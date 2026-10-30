import { generateCaptchaChallenge } from "@/lib/captcha";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const challenge = generateCaptchaChallenge();
        return NextResponse.json(challenge, {
            headers: {
                "Cache-Control": "no-store, max-age=0",
            },
        });
    } catch (error) {
        console.error("Failed to generate captcha:", error);
        return NextResponse.json(
            { error: "Failed to generate security check" },
            { status: 500 }
        );
    }
}
