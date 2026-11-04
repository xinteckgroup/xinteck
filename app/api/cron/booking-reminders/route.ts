import { INTERNAL_getSecret } from "@/actions/settings";
import { BookingReminderEmail } from "@/components/emails/BookingReminderEmail";
import { prisma } from "@/lib/prisma";
import { NotificationService } from "@/lib/services/notification-service";
import { BookingStatus } from "@prisma/client";
import { render } from "@react-email/render";
import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { Resend } from "resend";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60s for DB lookups, React Email rendering & email dispatches

/**
 * Automated Cron Job Endpoint for cron-job.org
 * Dispatches 24-hour and 1-hour email reminders with Google Meet links.
 * 
 * Invocation on cron-job.org:
 * URL: https://xinteck.co.ke/api/cron/booking-reminders
 * Schedule: Every 15 minutes
 * Header: Authorization: Bearer <CRON_SECRET> (or ?key=<CRON_SECRET>)
 */
export async function GET(req: NextRequest) {
    return handleCron(req);
}

export async function POST(req: NextRequest) {
    return handleCron(req);
}

async function handleCron(req: NextRequest) {
    try {
        // 1. Authorization Check (support both Bearer header and query param, sanitized)
        const cronSecret = (process.env.CRON_SECRET || "xinteck-cron-secret-key-2026").trim();
        const authHeader = req.headers.get("authorization")?.trim();
        const keyParam = req.nextUrl.searchParams.get("key")?.trim();

        const isAuthorized =
            (authHeader && (authHeader === `Bearer ${cronSecret}` || authHeader.toLowerCase() === `bearer ${cronSecret.toLowerCase()}`)) ||
            (keyParam && keyParam === cronSecret);

        if (!isAuthorized) {
            return NextResponse.json({ error: "Unauthorized cron request" }, { status: 401 });
        }

        // 2. Fetch email credentials (with fallback to env vars)
        const dbApiKey = await INTERNAL_getSecret("RESEND_API_KEY");
        const dbFrom = await INTERNAL_getSecret("RESEND_FROM_EMAIL");

        const apiKey = dbApiKey || process.env.RESEND_API_KEY || process.env.RESEND_KI;
        const rawFrom = dbFrom || process.env.RESEND_FROM_EMAIL || "info@xinteck.co.ke";
        const senderAddress = rawFrom.includes("<") ? rawFrom : `Xinteck Technologies <${rawFrom}>`;

        if (!apiKey) {
            console.error("[Cron booking-reminders] Resend API key is not configured in DB or Environment");
            return NextResponse.json({ error: "Resend API key not configured" }, { status: 500 });
        }

        const resend = new Resend(apiKey);

        // 3. Current time in UTC
        const nowUtc = new Date();
        const nowMs = nowUtc.getTime();

        // 4. Fetch confirmed bookings that haven't received reminder yet and have a Meet link
        const yesterday = new Date(nowMs - 24 * 60 * 60 * 1000);
        yesterday.setUTCHours(0, 0, 0, 0);

        const candidateBookings = await prisma.discoveryBooking.findMany({
            where: {
                status: BookingStatus.CONFIRMED,
                meetLink: { not: null },
                reminderEmailSent: false,
                date: { gte: yesterday },
            },
        });

        let sentCount = 0;
        let skippedCount = 0;
        const processedBookings: string[] = [];
        const failedBookings: Array<{ id: string; email: string; reason: string }> = [];

        // 5. Process candidate bookings with per-item resilience
        for (const booking of candidateBookings) {
            if (!booking.meetLink || !booking.startTime || !booking.email) {
                skippedCount++;
                continue;
            }

            try {
                const dateStr = booking.date.toISOString().split("T")[0]; // YYYY-MM-DD
                const timeParts = booking.startTime.split(":").map(Number);
                const [hours, minutes] = timeParts;

                if (isNaN(hours) || isNaN(minutes)) {
                    console.warn(`[Cron booking-reminders] Skipping booking ${booking.id} due to invalid startTime: "${booking.startTime}"`);
                    skippedCount++;
                    continue;
                }

                // Construct Nairobi time as UTC date: EAT is UTC+3 (subtract 3 hours)
                const callTimeUtc = new Date(
                    Date.UTC(
                        booking.date.getUTCFullYear(),
                        booking.date.getUTCMonth(),
                        booking.date.getUTCDate(),
                        hours - 3,
                        minutes,
                        0
                    )
                );

                const diffMinutes = (callTimeUtc.getTime() - nowMs) / (1000 * 60);

                // Trigger window:
                // 24 hours (between 23h and 25h away) OR upcoming (within next 2 hours)
                const shouldSendReminder =
                    (diffMinutes >= 23 * 60 && diffMinutes <= 25 * 60) ||
                    (diffMinutes > 0 && diffMinutes <= 120);

                if (!shouldSendReminder) {
                    skippedCount++;
                    continue;
                }

                const reminderType = diffMinutes <= 120 ? "1h" : "24h";

                const html = await render(
                    BookingReminderEmail({
                        name: booking.name,
                        date: dateStr,
                        startTime: booking.startTime,
                        endTime: booking.endTime,
                        meetLink: booking.meetLink,
                        reminderType,
                        rescheduleUrl: `https://xinteck.co.ke/book/reschedule?id=${booking.id}`,
                    }) as React.ReactElement
                );

                const { error: sendError } = await resend.emails.send({
                    from: senderAddress,
                    to: [booking.email],
                    replyTo: "info@xinteck.co.ke",
                    subject:
                        reminderType === "1h"
                            ? `⏰ Starting Soon: Discovery Call with Xinteck (${booking.startTime} EAT)`
                            : `🗓️ Reminder: Your Discovery Call with Xinteck Tomorrow (${booking.startTime} EAT)`,
                    html,
                });

                if (sendError) {
                    throw new Error(`Resend send error: ${sendError.message}`);
                }

                // Mark reminder as dispatched
                await prisma.discoveryBooking.update({
                    where: { id: booking.id },
                    data: { reminderEmailSent: true },
                });

                sentCount++;
                processedBookings.push(`${booking.id} (${booking.name}) - ${reminderType}`);
            } catch (bookingError: any) {
                console.error(`[Cron booking-reminders] Failed to dispatch reminder for booking ${booking.id} (${booking.email}):`, bookingError);
                failedBookings.push({
                    id: booking.id,
                    email: booking.email,
                    reason: bookingError?.message || "Unknown reminder dispatch failure",
                });
            }
        }

        // Housekeeping: automatically purge expired in-app admin notifications
        await NotificationService.cleanupExpired().catch((e) =>
            console.error("[Cron booking-reminders] Notification cleanup error:", e)
        );

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            candidatesFound: candidateBookings.length,
            remindersSent: sentCount,
            remindersSkipped: skippedCount,
            failedCount: failedBookings.length,
            processed: processedBookings,
            errors: failedBookings.length > 0 ? failedBookings : undefined,
        });
    } catch (error: any) {
        console.error("[Cron booking-reminders] Unhandled error:", error);
        return NextResponse.json(
            { success: false, error: error?.message || "Internal cron error" },
            { status: 500 }
        );
    }
}
