import { createBooking } from "@/actions/bookings";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Extract client IP and user agent for anti-abuse logs
        const forwardedFor = req.headers.get("x-forwarded-for");
        const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
        const userAgent = req.headers.get("user-agent") || "unknown";

        const result = await createBooking(body, clientIp, userAgent);

        if (!result.success) {
            return NextResponse.json(
                {
                    error: result.error,
                    slotConflict: result.slotConflict || false,
                },
                { status: result.slotConflict ? 409 : 400 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Discovery call booked successfully! Please check your email for confirmation details.",
                booking: result.booking,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Booking submission API error:", error);
        return NextResponse.json(
            { error: "Internal server error. Please try again." },
            { status: 500 }
        );
    }
}
