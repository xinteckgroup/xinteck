"use server";

import { INTERNAL_getSecret } from "@/actions/settings";
import { AdminBookingAlertEmail } from "@/components/emails/AdminBookingAlertEmail";
import { BookingCancellationEmail } from "@/components/emails/BookingCancellationEmail";
import { BookingConfirmedEmail } from "@/components/emails/BookingConfirmedEmail";
import { BookingReceivedEmail } from "@/components/emails/BookingReceivedEmail";
import { logAudit } from "@/lib/audit";
import { requireRole } from "@/lib/auth-check";
import {
    BOOKING_CONFIG,
    calculateSlotEndTime,
    generateGoogleCalendarUrl,
    isDateInPast,
    isSlotWithinLeadBuffer,
} from "@/lib/booking-utils";
import { createPaginatedResult, getPaginationParams, PaginatedResponse, PaginationParams } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import { verifyCaptchaSolution } from "@/lib/captcha";
import { NotificationService } from "@/lib/services/notification-service";
import {
    addBlockedDateSchema,
    bookingRequestSchema,
    cancelBookingSchema,
    confirmBookingSchema,
    rescheduleBookingSchema,
    updateAvailabilityDaySchema,
} from "@/lib/validations";
import { BookingStatus, NotificationPriority, NotificationType, Role } from "@prisma/client";
import { render } from "@react-email/render";
import { revalidatePath } from "next/cache";
import React from "react";
import { Resend } from "resend";

export type BookingFilter = PaginationParams & {
    status?: BookingStatus | "ALL";
    search?: string;
    date?: string; // YYYY-MM-DD
    hostId?: string;
};

// Helper: Initialize Resend Client & Config
async function getEmailConfig() {
    const apiKey = (await INTERNAL_getSecret("RESEND_API_KEY")) || process.env.RESEND_API_KEY || process.env.RESEND_KI;
    const fromEmail = (await INTERNAL_getSecret("RESEND_FROM_EMAIL")) || "Xinteck <info@xinteck.co.ke>";
    const toEmail = (await INTERNAL_getSecret("RESEND_TO_EMAIL")) || "info@xinteck.co.ke";

    const senderAddress = fromEmail.includes("<") ? fromEmail : `Xinteck <${fromEmail}>`;

    return {
        resend: apiKey ? new Resend(apiKey) : null,
        senderAddress,
        adminRecipient: toEmail,
    };
}

// ═══════════════════════════════════════════════════════════════
// 1. PUBLIC BOOKING ACTIONS
// ═══════════════════════════════════════════════════════════════

export async function createBooking(rawInput: unknown, clientIp?: string, userAgent?: string) {
    const parseResult = bookingRequestSchema.safeParse(rawInput);
    if (!parseResult.success) {
        return {
            success: false,
            error: parseResult.error.issues[0]?.message || "Invalid booking data",
        };
    }

    const data = parseResult.data;

    // Honeypot bot protection
    if (data.honeypot && data.honeypot.length > 0) {
        return { success: false, error: "Bot detected" };
    }

    // Cryptographic Math Captcha verification (prevents replay, tampering, and non-numeric inputs)
    if (data.captchaToken || data.captchaAnswer !== undefined) {
        const captchaCheck = verifyCaptchaSolution(data.captchaToken, data.captchaAnswer);
        if (!captchaCheck.valid) {
            return {
                success: false,
                error: captchaCheck.error || "Security verification failed. Please try again.",
            };
        }
    }

    // IP Rate Limiting (Prevent flood & brute force spam)
    if (clientIp && clientIp !== "unknown" && clientIp !== "127.0.0.1") {
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        const recentSubmissions = await prisma.discoveryBooking.count({
            where: {
                ipAddress: clientIp,
                createdAt: { gte: tenMinutesAgo },
            },
        });
        if (recentSubmissions >= 5) {
            return {
                success: false,
                error: "Too many reservation requests. Please wait a few minutes before trying again.",
            };
        }
    }

    // Past date & buffer checks
    if (isDateInPast(data.date)) {
        return { success: false, error: "Cannot book appointments on past dates." };
    }

    if (isSlotWithinLeadBuffer(data.date, data.startTime)) {
        return { success: false, error: "Please choose a time at least 2 hours in advance." };
    }

    const bookingDate = new Date(`${data.date}T00:00:00.000Z`);
    const dayOfWeek = bookingDate.getUTCDay();

    // Check blocked dates / holidays
    const isBlocked = await prisma.bookingBlockedDate.findUnique({
        where: { date: bookingDate },
    });
    if (isBlocked) {
        return {
            success: false,
            error: `Selected date is unavailable: ${isBlocked.reason || "Office Closed"}.`,
        };
    }

    // Check weekly availability for day of week
    const availability = await prisma.bookingAvailability.findUnique({
        where: { dayOfWeek },
    });
    if (!availability || !availability.isActive) {
        return { success: false, error: "Xinteck is closed on this day. We operate Mon-Thu 9am-5pm and Fri 9am-12pm." };
    }

    // Calculate endTime with 15-minute duration
    const endTime = calculateSlotEndTime(data.startTime);

    try {
        // Layer 2: Pre-check concurrency in DB
        const existing = await prisma.discoveryBooking.findUnique({
            where: {
                unique_booking_slot: {
                    date: bookingDate,
                    startTime: data.startTime,
                },
            },
        });

        if (existing && !["CANCELLED", "RESCHEDULED"].includes(existing.status)) {
            return {
                success: false,
                error: "This time slot was just booked by another visitor! Please pick another available time.",
                slotConflict: true,
            };
        }

        // Layer 3: Database creation with unique constraint
        const booking = await prisma.discoveryBooking.create({
            data: {
                name: data.name,
                email: data.email.toLowerCase(),
                phone: data.phone,
                company: data.company || null,
                service: data.service || null,
                message: data.message || null,
                date: bookingDate,
                startTime: data.startTime,
                endTime,
                timezone: BOOKING_CONFIG.TIMEZONE,
                status: BookingStatus.PENDING,
                ipAddress: clientIp || null,
                userAgent: userAgent || null,
            },
        });

        // Audit Logging
        await logAudit({
            action: "booking.create",
            entity: "DiscoveryBooking",
            entityId: booking.id,
            details: `Discovery call booked by ${data.name} on ${data.date} at ${data.startTime} EAT`,
        });

        // In-App Notification to Admins
        try {
            await NotificationService.broadcastToRoles({
                roles: [Role.ADMIN, Role.SUPER_ADMIN],
                type: NotificationType.INFO,
                priority: NotificationPriority.HIGH,
                title: "🗓️ New Discovery Call Booking",
                message: `${data.name} booked a call for ${data.date} at ${data.startTime} EAT.`,
                link: `/admin/bookings?id=${booking.id}`,
            });
        } catch (notifErr) {
            console.error("Failed to create in-app notification:", notifErr);
        }

        // Send Email Notifications
        const { resend, senderAddress, adminRecipient } = await getEmailConfig();

        if (resend) {
            // (a) Admin Alert Email
            try {
                const adminHtml = await render(
                    AdminBookingAlertEmail({
                        id: booking.id,
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        company: data.company,
                        service: data.service,
                        message: data.message,
                        date: data.date,
                        startTime: data.startTime,
                        endTime,
                    }) as React.ReactElement
                );

                await resend.emails.send({
                    from: senderAddress,
                    to: [adminRecipient],
                    replyTo: data.email,
                    subject: `🗓️ New Discovery Call: ${data.name} — ${data.date} at ${data.startTime} EAT`,
                    html: adminHtml,
                });
            } catch (emailErr) {
                console.error("Failed to dispatch admin booking alert email:", emailErr);
            }

            // (b) Customer Acknowledgment Email
            try {
                const customerHtml = await render(
                    BookingReceivedEmail({
                        name: data.name,
                        date: data.date,
                        startTime: data.startTime,
                        endTime,
                        service: data.service,
                    }) as React.ReactElement
                );

                await resend.emails.send({
                    from: senderAddress,
                    to: [data.email],
                    replyTo: "info@xinteck.co.ke",
                    subject: "Your Discovery Call Request with Xinteck is Received! 🎯",
                    html: customerHtml,
                });

                await prisma.discoveryBooking.update({
                    where: { id: booking.id },
                    data: { confirmationEmailSent: true },
                });
            } catch (custEmailErr) {
                console.error("Failed to dispatch customer acknowledgment email:", custEmailErr);
            }
        }

        revalidatePath("/admin/bookings");

        return {
            success: true,
            booking: {
                id: booking.id,
                date: data.date,
                startTime: data.startTime,
                endTime,
                name: data.name,
                email: data.email,
            },
        };
    } catch (err: any) {
        if (err.code === "P2002") {
            return {
                success: false,
                error: "This time slot was just taken by another visitor. Please select another slot.",
                slotConflict: true,
            };
        }
        console.error("Error creating discovery booking:", err);
        return { success: false, error: "An unexpected error occurred while booking. Please try again." };
    }
}

// ═══════════════════════════════════════════════════════════════
// 2. ADMIN BOOKING MANAGEMENT ACTIONS (Strict RBAC)
// ═══════════════════════════════════════════════════════════════

export async function getBookings(params: BookingFilter = {}): Promise<PaginatedResponse<any>> {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);

    const { page, pageSize: limit, skip } = getPaginationParams(params);
    const { status, search, date, hostId } = params;

    const where: any = {};

    if (status && status !== "ALL") {
        where.status = status;
    }

    if (date) {
        where.date = new Date(`${date}T00:00:00.000Z`);
    }

    if (hostId) {
        where.assignedToId = hostId;
    }

    if (search && search.trim()) {
        const query = search.trim();
        where.OR = [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { phone: { contains: query, mode: "insensitive" } },
            { company: { contains: query, mode: "insensitive" } },
            { service: { contains: query, mode: "insensitive" } },
        ];
    }

    const [total, items] = await Promise.all([
        prisma.discoveryBooking.count({ where }),
        prisma.discoveryBooking.findMany({
            where,
            orderBy: [{ date: "desc" }, { startTime: "asc" }],
            skip,
            take: limit,
            include: {
                assignedTo: {
                    select: { id: true, name: true, email: true, role: true, avatar: true },
                },
            },
        }),
    ]);

    const formatted = items.map((b) => ({
        ...b,
        dateFormatted: b.date.toISOString().split("T")[0],
    }));

    return createPaginatedResult(formatted, total, page, limit);
}

export async function getBookingById(id: string) {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);

    const booking = await prisma.discoveryBooking.findUnique({
        where: { id },
        include: {
            assignedTo: {
                select: { id: true, name: true, email: true, role: true, avatar: true },
            },
        },
    });

    if (!booking) return null;

    return {
        ...booking,
        dateFormatted: booking.date.toISOString().split("T")[0],
    };
}

export async function confirmBooking(rawInput: unknown) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);

    const parseResult = confirmBookingSchema.safeParse(rawInput);
    if (!parseResult.success) {
        return { success: false, error: parseResult.error.issues[0]?.message || "Invalid input" };
    }

    const { bookingId, meetLink, adminNotes } = parseResult.data;

    const booking = await prisma.discoveryBooking.findUnique({
        where: { id: bookingId },
    });

    if (!booking) {
        return { success: false, error: "Booking not found." };
    }

    const dateStr = booking.date.toISOString().split("T")[0];

    const updated = await prisma.discoveryBooking.update({
        where: { id: bookingId },
        data: {
            status: BookingStatus.CONFIRMED,
            meetLink,
            confirmedBy: user.id,
            adminNotes: adminNotes ? (booking.adminNotes ? `${booking.adminNotes}\n\n${adminNotes}` : adminNotes) : booking.adminNotes,
        },
    });

    await logAudit({
        action: "booking.confirm",
        entity: "DiscoveryBooking",
        entityId: bookingId,
        details: `Confirmed booking for ${booking.name} with Meet link: ${meetLink}`,
    });

    // Send Confirmation Email with Meet Link & Google Calendar CTA
    const { resend, senderAddress } = await getEmailConfig();

    if (resend) {
        try {
            const googleCalUrl = generateGoogleCalendarUrl({
                title: `Discovery Call: Xinteck Technologies & ${booking.name}`,
                description: `15-Minute Technical Discovery & Consultation Session.`,
                startDate: dateStr,
                startTime: booking.startTime,
                endTime: booking.endTime,
                meetLink,
            });

            const html = await render(
                BookingConfirmedEmail({
                    name: booking.name,
                    date: dateStr,
                    startTime: booking.startTime,
                    endTime: booking.endTime,
                    meetLink,
                    googleCalendarUrl: googleCalUrl,
                    adminNote: adminNotes,
                }) as React.ReactElement
            );

            await resend.emails.send({
                from: senderAddress,
                to: [booking.email],
                replyTo: "info@xinteck.co.ke",
                subject: `Confirmed! Your Discovery Call with Xinteck — ${dateStr} at ${booking.startTime} EAT ✅`,
                html,
            });
        } catch (err) {
            console.error("Failed to send customer confirmation email:", err);
        }
    }

    revalidatePath("/admin/bookings");
    return { success: true, booking: updated };
}

export async function assignBookingHost(bookingId: string, assignedToId: string | null) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);

    const booking = await prisma.discoveryBooking.update({
        where: { id: bookingId },
        data: { assignedToId },
        include: { assignedTo: true },
    });

    await logAudit({
        action: "booking.assign",
        entity: "DiscoveryBooking",
        entityId: bookingId,
        details: `Assigned booking ${bookingId} to user ${assignedToId || "None"} by ${user.name}`,
    });

    revalidatePath("/admin/bookings");
    return { success: true, booking };
}

export async function cancelBooking(rawInput: unknown) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);

    const parseResult = cancelBookingSchema.safeParse(rawInput);
    if (!parseResult.success) {
        return { success: false, error: parseResult.error.issues[0]?.message || "Invalid input" };
    }

    const { bookingId, reason } = parseResult.data;

    const booking = await prisma.discoveryBooking.findUnique({
        where: { id: bookingId },
    });

    if (!booking) return { success: false, error: "Booking not found." };

    const dateStr = booking.date.toISOString().split("T")[0];

    const updated = await prisma.discoveryBooking.update({
        where: { id: bookingId },
        data: {
            status: BookingStatus.CANCELLED,
            cancelledBy: user.name || "admin",
            cancelReason: reason,
        },
    });

    await logAudit({
        action: "booking.cancel",
        entity: "DiscoveryBooking",
        entityId: bookingId,
        details: `Cancelled booking for ${booking.name}. Reason: ${reason}`,
    });

    // Send polite cancellation email
    const { resend, senderAddress } = await getEmailConfig();
    if (resend) {
        try {
            const html = await render(
                BookingCancellationEmail({
                    name: booking.name,
                    date: dateStr,
                    startTime: booking.startTime,
                    reason,
                }) as React.ReactElement
            );

            await resend.emails.send({
                from: senderAddress,
                to: [booking.email],
                replyTo: "info@xinteck.co.ke",
                subject: `Discovery Call Update — Xinteck (${dateStr})`,
                html,
            });
        } catch (err) {
            console.error("Failed to send cancellation email:", err);
        }
    }

    revalidatePath("/admin/bookings");
    return { success: true, booking: updated };
}

export async function completeBooking(bookingId: string, notes?: string) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);

    const existing = await prisma.discoveryBooking.findUnique({ where: { id: bookingId } });
    if (!existing) return { success: false, error: "Booking not found." };

    const updatedNotes = notes
        ? existing.adminNotes
            ? `${existing.adminNotes}\n\n[Completed - ${new Date().toLocaleDateString()}] ${notes}`
            : `[Completed - ${new Date().toLocaleDateString()}] ${notes}`
        : existing.adminNotes;

    const updated = await prisma.discoveryBooking.update({
        where: { id: bookingId },
        data: {
            status: BookingStatus.COMPLETED,
            adminNotes: updatedNotes,
        },
    });

    await logAudit({
        action: "booking.complete",
        entity: "DiscoveryBooking",
        entityId: bookingId,
        details: `Marked discovery call with ${existing.name} as COMPLETED by ${user.name}`,
    });

    revalidatePath("/admin/bookings");
    return { success: true, booking: updated };
}

export async function markNoShow(bookingId: string, notes?: string) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);

    const existing = await prisma.discoveryBooking.findUnique({ where: { id: bookingId } });
    if (!existing) return { success: false, error: "Booking not found." };

    const updatedNotes = notes
        ? existing.adminNotes
            ? `${existing.adminNotes}\n\n[No-Show - ${new Date().toLocaleDateString()}] ${notes}`
            : `[No-Show - ${new Date().toLocaleDateString()}] ${notes}`
        : existing.adminNotes;

    const updated = await prisma.discoveryBooking.update({
        where: { id: bookingId },
        data: {
            status: BookingStatus.NO_SHOW,
            adminNotes: updatedNotes,
        },
    });

    await logAudit({
        action: "booking.no_show",
        entity: "DiscoveryBooking",
        entityId: bookingId,
        details: `Marked discovery call with ${existing.name} as NO_SHOW by ${user.name}`,
    });

    revalidatePath("/admin/bookings");
    return { success: true, booking: updated };
}

export async function addBookingNote(bookingId: string, noteText: string) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);

    const existing = await prisma.discoveryBooking.findUnique({ where: { id: bookingId } });
    if (!existing) return { success: false, error: "Booking not found." };

    const newNote = `[${user.name} - ${new Date().toLocaleDateString()}]: ${noteText.trim()}`;
    const combined = existing.adminNotes ? `${existing.adminNotes}\n\n${newNote}` : newNote;

    const updated = await prisma.discoveryBooking.update({
        where: { id: bookingId },
        data: { adminNotes: combined },
    });

    await logAudit({
        action: "booking.note",
        entity: "DiscoveryBooking",
        entityId: bookingId,
        details: `Added note to booking ${bookingId} by ${user.name}`,
    });

    revalidatePath("/admin/bookings");
    return { success: true, booking: updated };
}

export async function deleteBooking(bookingId: string) {
    const user = await requireRole([Role.SUPER_ADMIN]);

    const existing = await prisma.discoveryBooking.findUnique({ where: { id: bookingId } });
    if (!existing) return { success: false, error: "Booking not found." };

    await prisma.discoveryBooking.delete({ where: { id: bookingId } });

    await logAudit({
        action: "booking.delete",
        entity: "DiscoveryBooking",
        entityId: bookingId,
        details: `Hard deleted booking for ${existing.name} by Super Admin ${user.name}`,
    });

    revalidatePath("/admin/bookings");
    return { success: true };
}

// ═══════════════════════════════════════════════════════════════
// 3. AVAILABILITY & BLOCKED DATES (RBAC Managed)
// ═══════════════════════════════════════════════════════════════

export async function getWeeklyAvailability() {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);

    return prisma.bookingAvailability.findMany({
        orderBy: { dayOfWeek: "asc" },
    });
}

export async function updateWeeklyAvailabilityDay(rawInput: unknown) {
    const user = await requireRole([Role.SUPER_ADMIN]);

    const parseResult = updateAvailabilityDaySchema.safeParse(rawInput);
    if (!parseResult.success) {
        return { success: false, error: parseResult.error.issues[0]?.message || "Invalid input" };
    }

    const { dayOfWeek, startTime, endTime, isActive } = parseResult.data;

    const updated = await prisma.bookingAvailability.upsert({
        where: { dayOfWeek },
        update: { startTime, endTime, isActive },
        create: { dayOfWeek, startTime, endTime, isActive },
    });

    await logAudit({
        action: "booking.availability_update",
        entity: "BookingAvailability",
        entityId: updated.id,
        details: `Updated availability for day ${dayOfWeek} to ${startTime}-${endTime} (active: ${isActive}) by ${user.name}`,
    });

    revalidatePath("/admin/bookings");
    return { success: true, availability: updated };
}

export async function getBlockedDates() {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);

    const items = await prisma.bookingBlockedDate.findMany({
        orderBy: { date: "asc" },
    });

    return items.map((b) => ({
        ...b,
        dateFormatted: b.date.toISOString().split("T")[0],
    }));
}

export async function addBlockedDate(rawInput: unknown) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);

    const parseResult = addBlockedDateSchema.safeParse(rawInput);
    if (!parseResult.success) {
        return { success: false, error: parseResult.error.issues[0]?.message || "Invalid input" };
    }

    const { date, reason } = parseResult.data;
    const targetDate = new Date(`${date}T00:00:00.000Z`);

    // Check if there are active bookings on this date (Anti-collision UX check)
    const activeBookingsCount = await prisma.discoveryBooking.count({
        where: {
            date: targetDate,
            status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        },
    });

    const blocked = await prisma.bookingBlockedDate.upsert({
        where: { date: targetDate },
        update: { reason },
        create: { date: targetDate, reason },
    });

    await logAudit({
        action: "booking.blocked_date_add",
        entity: "BookingBlockedDate",
        entityId: blocked.id,
        details: `Blocked date ${date} for reason: "${reason}" by ${user.name}`,
    });

    revalidatePath("/admin/bookings");
    return {
        success: true,
        blocked: { ...blocked, dateFormatted: date },
        conflictCount: activeBookingsCount,
    };
}

export async function removeBlockedDate(id: string) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);

    const existing = await prisma.bookingBlockedDate.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "Blocked date not found." };

    await prisma.bookingBlockedDate.delete({ where: { id } });

    await logAudit({
        action: "booking.blocked_date_remove",
        entity: "BookingBlockedDate",
        entityId: id,
        details: `Unblocked date ${existing.date.toISOString().split("T")[0]} by ${user.name}`,
    });

    revalidatePath("/admin/bookings");
    return { success: true };
}

export async function getBookingStats() {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);

    const todayStr = new Date().toISOString().split("T")[0];
    const todayDate = new Date(`${todayStr}T00:00:00.000Z`);

    const [pendingCount, confirmedCount, completedCount, todayCount, totalCount, nextCallBooking] = await Promise.all([
        prisma.discoveryBooking.count({ where: { status: BookingStatus.PENDING } }),
        prisma.discoveryBooking.count({ where: { status: BookingStatus.CONFIRMED } }),
        prisma.discoveryBooking.count({ where: { status: BookingStatus.COMPLETED } }),
        prisma.discoveryBooking.count({
            where: {
                date: todayDate,
                status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
            },
        }),
        prisma.discoveryBooking.count(),
        prisma.discoveryBooking.findFirst({
            where: {
                date: { gte: todayDate },
                status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
            },
            orderBy: [{ date: "asc" }, { startTime: "asc" }],
            select: {
                name: true,
                date: true,
                startTime: true,
                service: true,
            },
        }),
    ]);

    return {
        pendingCount,
        confirmedCount,
        completedCount,
        todayCount,
        totalCount,
        nextCall: nextCallBooking
            ? {
                  name: nextCallBooking.name,
                  date: nextCallBooking.date.toISOString().split("T")[0],
                  startTime: nextCallBooking.startTime,
                  service: nextCallBooking.service || undefined,
              }
            : null,
    };
}

export async function getBookingForReschedule(id: string) {
    if (!id || typeof id !== "string") return null;

    const booking = await prisma.discoveryBooking.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            service: true,
            date: true,
            startTime: true,
            endTime: true,
            status: true,
            meetLink: true,
        },
    });

    if (!booking) return null;

    const dateStr = booking.date.toISOString().split("T")[0];
    const isLocked = isSlotWithinLeadBuffer(dateStr, booking.startTime);

    return {
        ...booking,
        dateFormatted: dateStr,
        isLocked,
    };
}

export async function customerRescheduleBooking(rawInput: unknown) {
    const parseResult = rescheduleBookingSchema.safeParse(rawInput);
    if (!parseResult.success) {
        return { success: false, error: parseResult.error.issues[0]?.message || "Invalid input" };
    }

    const { bookingId, newDate, newStartTime, reason } = parseResult.data;

    const existing = await prisma.discoveryBooking.findUnique({
        where: { id: bookingId },
    });

    if (!existing) {
        return { success: false, error: "Booking not found." };
    }

    if (existing.status === BookingStatus.CANCELLED || existing.status === BookingStatus.COMPLETED) {
        return {
            success: false,
            error: `This call was marked as ${existing.status.toLowerCase()} and cannot be rescheduled.`,
        };
    }

    // 2-hour lead buffer lockout on current booking
    const currentDateStr = existing.date.toISOString().split("T")[0];
    if (isSlotWithinLeadBuffer(currentDateStr, existing.startTime)) {
        return {
            success: false,
            error: "Rescheduling is closed within 2 hours of your scheduled time. Please reach out to info@xinteck.co.ke.",
        };
    }

    // New date validations
    if (isDateInPast(newDate)) {
        return { success: false, error: "Cannot reschedule to a past date." };
    }

    if (isSlotWithinLeadBuffer(newDate, newStartTime)) {
        return { success: false, error: "Please select a time slot at least 2 hours in advance." };
    }

    const targetDate = new Date(`${newDate}T00:00:00.000Z`);
    const dayOfWeek = targetDate.getUTCDay();

    // Check holiday / blocked
    const isBlocked = await prisma.bookingBlockedDate.findUnique({
        where: { date: targetDate },
    });
    if (isBlocked) {
        return { success: false, error: `The chosen date is unavailable (${isBlocked.reason || "Office Closed"}).` };
    }

    // Check working hours
    const availability = await prisma.bookingAvailability.findUnique({
        where: { dayOfWeek },
    });
    if (!availability || !availability.isActive) {
        return { success: false, error: "Xinteck is closed on this day." };
    }

    // Collision check on new slot
    const slotCollision = await prisma.discoveryBooking.findFirst({
        where: {
            date: targetDate,
            startTime: newStartTime,
            id: { not: bookingId },
            status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        },
    });

    if (slotCollision) {
        return {
            success: false,
            error: "This time slot was just booked by another visitor. Please choose another time.",
            slotConflict: true,
        };
    }

    const newEndTime = calculateSlotEndTime(newStartTime);

    // Update appointment slot
    const updated = await prisma.discoveryBooking.update({
        where: { id: bookingId },
        data: {
            date: targetDate,
            startTime: newStartTime,
            endTime: newEndTime,
            reminderEmailSent: false, // Reset reminder flag so they receive a fresh reminder
            adminNotes: reason
                ? existing.adminNotes
                    ? `${existing.adminNotes}\n\n[Rescheduled by Customer]: ${reason}`
                    : `[Rescheduled by Customer]: ${reason}`
                : existing.adminNotes,
        },
    });

    await logAudit({
        action: "booking.reschedule",
        entity: "DiscoveryBooking",
        entityId: bookingId,
        details: `Customer rescheduled booking from ${currentDateStr} ${existing.startTime} to ${newDate} ${newStartTime}. Reason: ${reason || "None"}`,
    });

    // Notify Customer and Admin
    const { resend, senderAddress, adminRecipient } = await getEmailConfig();
    if (resend) {
        try {
            const googleCalUrl = generateGoogleCalendarUrl({
                title: `Discovery Call: Xinteck Technologies & ${existing.name}`,
                description: `15-Minute Technical Discovery & Consultation Session.`,
                startDate: newDate,
                startTime: newStartTime,
                endTime: newEndTime,
                meetLink: existing.meetLink || undefined,
            });

            const customerHtml = await render(
                BookingConfirmedEmail({
                    name: existing.name,
                    date: newDate,
                    startTime: newStartTime,
                    endTime: newEndTime,
                    meetLink: existing.meetLink || "https://meet.google.com/new",
                    googleCalendarUrl: googleCalUrl,
                    adminNote: `Your appointment has been successfully rescheduled to ${newDate} at ${newStartTime} EAT.`,
                }) as React.ReactElement
            );

            await resend.emails.send({
                from: senderAddress,
                to: [existing.email],
                replyTo: "info@xinteck.co.ke",
                subject: `Rescheduled: Your Discovery Call with Xinteck — ${newDate} at ${newStartTime} EAT ✅`,
                html: customerHtml,
            });

            await resend.emails.send({
                from: senderAddress,
                to: [adminRecipient],
                replyTo: existing.email,
                subject: `🗓️ Reschedule Alert: ${existing.name} moved call to ${newDate} at ${newStartTime} EAT`,
                text: `${existing.name} has rescheduled their discovery call.\nPrevious: ${currentDateStr} at ${existing.startTime} EAT\nNew: ${newDate} at ${newStartTime} EAT\nReason: ${reason || "None"}\nAdmin: https://xinteck.co.ke/admin/bookings`,
            });
        } catch (emailErr) {
            console.error("Failed to send reschedule notification emails:", emailErr);
        }
    }

    revalidatePath("/admin/bookings");
    revalidatePath("/book");

    return {
        success: true,
        booking: {
            ...updated,
            dateFormatted: newDate,
        },
    };
}
