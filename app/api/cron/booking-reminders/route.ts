import { INTERNAL_getSecret } from "@/actions/settings";
import { BookingReminderEmail } from "@/components/emails/BookingReminderEmail";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";
import { render } from "@react-email/render";
import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

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
        // 1. Authorization Check
        const cronSecret = process.env.CRON_SECRET || "xinteck-cron-secret-key-2026";
        const authHeader = req.headers.get("authorization");
        const keyParam = req.nextUrl.searchParams.get("key");

        const isAuthorized =
            authHeader === `Bearer ${cronSecret}` ||
            keyParam === cronSecret;

        if (!isAuthorized) {
            return NextResponse.json({ error: "Unauthorized cron request" }, { status: 401 });
        }

        // 2. Fetch email credentials
        const dbApiKey = await INTERNAL_getSecret("resend_api_key");
        const dbFrom = await INTERNAL_getSecret("resend_from_email");

        const apiKey = dbApiKey || process.env.RESEND_API_KEY;
        const senderAddress = dbFrom || process.env.RESEND_FROM_EMAIL || "Xinteck Technologies <info@xinteck.co.ke>";

        if (!apiKey) {
            return NextResponse.json({ error: "Resend API key not configured" }, { status: 500 });
        }

        const resend = new Resend(apiKey);

        // 3. Current time in UTC
        const nowUtc = new Date();
        const nowMs = nowUtc.getTime();

        // 4. Fetch confirmed bookings that haven't received reminder yet and have a Meet link
        const candidateBookings = await prisma.discoveryBooking.findMany({
            where: {
                status: BookingStatus.CONFIRMED,
                meetLink: { not: null },
                reminderEmailSent: false,
                date: { gte: new Date(nowMs - 24 * 60 * 60 * 1000) },
            },
        });

        let sentCount = 0;
        const processedBookings: string[] = [];

        for (const booking of candidateBookings) {
            const dateStr = booking.date.toISOString().split("T")[0]; // YYYY-MM-DD
            const [hours, minutes] = booking.startTime.split(":").map(Number);

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

            if (shouldSendReminder && booking.meetLink) {
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

                await resend.emails.send({
                    from: senderAddress,
                    to: [booking.email],
                    replyTo: "info@xinteck.co.ke",
                    subject:
                        reminderType === "1h"
                            ? `⏰ Starting Soon: Discovery Call with Xinteck (${booking.startTime} EAT)`
                            : `🗓️ Reminder: Your Discovery Call with Xinteck Tomorrow (${booking.startTime} EAT)`,
                    html,
                });

                // Mark reminder as dispatched
                await prisma.discoveryBooking.update({
                    where: { id: booking.id },
                    data: { reminderEmailSent: true },
                });

                sentCount++;
                processedBookings.push(`${booking.id} (${booking.name}) - ${reminderType}`);
            }
        }

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            candidatesFound: candidateBookings.length,
            remindersSent: sentCount,
            processed: processedBookings,
        });
    } catch (error: any) {
        console.error("Cron booking-reminders error:", error);
        return NextResponse.json(
            { error: error?.message || "Internal cron error" },
            { status: 500 }
        );
    }
}
