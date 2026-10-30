import {
    BOOKING_CONFIG,
    generateDayTimeSlots,
    isDateInPast,
    isSlotWithinLeadBuffer,
} from "@/lib/booking-utils";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const dateStr = searchParams.get("date");

        if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            return NextResponse.json(
                { error: "Date parameter is required in YYYY-MM-DD format." },
                { status: 400 }
            );
        }

        const targetDate = new Date(`${dateStr}T00:00:00.000Z`);
        const dayOfWeek = targetDate.getUTCDay();

        // 1. Check if date is in the past
        if (isDateInPast(dateStr)) {
            return NextResponse.json({
                date: dateStr,
                dayOfWeek,
                timezone: BOOKING_CONFIG.TIMEZONE,
                isBlocked: true,
                blockedReason: "Cannot book appointments on past dates.",
                slots: [],
            });
        }

        // 2. Check if date is blocked (Holiday or Admin-defined off-day)
        const blockedRecord = await prisma.bookingBlockedDate.findUnique({
            where: { date: targetDate },
        });

        if (blockedRecord) {
            return NextResponse.json({
                date: dateStr,
                dayOfWeek,
                timezone: BOOKING_CONFIG.TIMEZONE,
                isBlocked: true,
                blockedReason: blockedRecord.reason || "Office Closed",
                slots: [],
            });
        }

        // 3. Check weekly availability template
        const availability = await prisma.bookingAvailability.findUnique({
            where: { dayOfWeek },
        });

        if (!availability || !availability.isActive) {
            return NextResponse.json({
                date: dateStr,
                dayOfWeek,
                timezone: BOOKING_CONFIG.TIMEZONE,
                isBlocked: true,
                blockedReason: dayOfWeek === 0 || dayOfWeek === 6 ? "Weekend (Closed)" : "Closed on this day",
                slots: [],
            });
        }

        // 4. Generate all potential 15-minute slots with 20-minute break buffers
        const baseSlots = generateDayTimeSlots(availability.startTime, availability.endTime);

        // 5. Query all booked appointments for this date (excluding cancelled/rescheduled)
        const bookedAppointments = await prisma.discoveryBooking.findMany({
            where: {
                date: targetDate,
                status: {
                    notIn: [BookingStatus.CANCELLED, BookingStatus.RESCHEDULED],
                },
            },
            select: {
                startTime: true,
                status: true,
            },
        });

        const bookedSet = new Set(bookedAppointments.map((b) => b.startTime));

        // 6. Map slots with availability and explicit booked reasons
        const slots = baseSlots.map((slot) => {
            const isBooked = bookedSet.has(slot.startTime);
            const isBufferBlocked = isSlotWithinLeadBuffer(dateStr, slot.startTime);

            let available = true;
            let reason: "booked" | "past" | "buffer_blocked" | undefined = undefined;

            if (isBooked) {
                available = false;
                reason = "booked";
            } else if (isBufferBlocked) {
                available = false;
                reason = "buffer_blocked";
            }

            return {
                startTime: slot.startTime,
                endTime: slot.endTime,
                available,
                reason,
            };
        });

        return NextResponse.json({
            date: dateStr,
            dayOfWeek,
            dayName: BOOKING_CONFIG.DEFAULT_SCHEDULE[dayOfWeek]?.name || "Day",
            operatingHours: `${availability.startTime} - ${availability.endTime} EAT`,
            isHalfDay: dayOfWeek === 5, // Friday 9-12
            timezone: BOOKING_CONFIG.TIMEZONE,
            isBlocked: false,
            slots,
        });
    } catch (error) {
        console.error("Error fetching booking slots:", error);
        return NextResponse.json(
            { error: "Failed to fetch availability slots." },
            { status: 500 }
        );
    }
}
