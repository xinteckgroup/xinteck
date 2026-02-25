import { INTERNAL_getSecret } from "@/actions/settings";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/newsletter/unsubscribe?email=base64encoded
 * One-click unsubscribe endpoint (CAN-SPAM compliant).
 * Returns a simple HTML confirmation page.
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const encodedEmail = searchParams.get("email");

        if (!encodedEmail) {
            return new NextResponse(renderPage("Invalid Link", "This unsubscribe link is invalid."), {
                status: 400,
                headers: { "Content-Type": "text/html; charset=utf-8" },
            });
        }

        const email = Buffer.from(encodedEmail, "base64").toString("utf-8");

        if (!email || !email.includes("@")) {
            return new NextResponse(renderPage("Invalid Email", "Could not process unsubscription."), {
                status: 400,
                headers: { "Content-Type": "text/html; charset=utf-8" },
            });
        }

        // Update subscriber in DB
        const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { email } });

        if (!subscriber) {
            return new NextResponse(renderPage("Not Found", "This email is not in our subscriber list."), {
                status: 404,
                headers: { "Content-Type": "text/html; charset=utf-8" },
            });
        }

        if (!subscriber.isActive) {
            return new NextResponse(
                renderPage("Already Unsubscribed", "You are already unsubscribed from our mailing list."),
                { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
            );
        }

        // Unsubscribe in DB
        await prisma.newsletterSubscriber.update({
            where: { email },
            data: { isActive: false, unsubscribedAt: new Date() },
        });

        // Sync to Resend Audience (if configured)
        try {
            const apiKey = await INTERNAL_getSecret("RESEND_API_KEY");
            const audienceId = await INTERNAL_getSecret("RESEND_AUDIENCE_ID");

            if (apiKey && audienceId) {
                await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, unsubscribed: true }),
                });
            }
        } catch (err) {
            console.error("Resend Audience sync error:", err);
        }

        await logAudit({
            action: "newsletter.unsubscribe.self",
            entity: "NewsletterSubscriber",
            entityId: subscriber.id,
            metadata: { email, method: "one-click" },
        });

        return new NextResponse(
            renderPage(
                "Unsubscribed Successfully",
                `<strong>${email}</strong> has been removed from the Xinteck mailing list.<br><br>You will no longer receive newsletter emails from us.<br><br>If this was a mistake, you can re-subscribe through our website.`
            ),
            { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
        );

    } catch (error) {
        console.error("Unsubscribe Error:", error);
        return new NextResponse(renderPage("Error", "Something went wrong. Please try again later."), {
            status: 500,
            headers: { "Content-Type": "text/html; charset=utf-8" },
        });
    }
}

/**
 * Also support POST for List-Unsubscribe-Post header (RFC 8058 one-click)
 */
export async function POST(req: Request) {
    return GET(req);
}

function renderPage(title: string, message: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} — Xinteck</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #0A0A0A; 
            color: #E5E5E5; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            min-height: 100vh;
            padding: 20px;
        }
        .card {
            background: #111111;
            border: 1px solid #222222;
            border-radius: 16px;
            padding: 48px;
            max-width: 480px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        h1 { 
            color: #D4AF37; 
            font-size: 24px; 
            font-weight: 900; 
            margin-bottom: 16px;
            letter-spacing: -0.5px;
        }
        p { 
            color: #888888; 
            font-size: 14px; 
            line-height: 1.8; 
        }
        a {
            color: #D4AF37;
            text-decoration: none;
            font-weight: 700;
        }
        .logo { 
            margin-bottom: 32px; 
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="logo">
            <img src="https://xinteck.co.ke/logos/logo-dark-full.png" alt="Xinteck" width="140" style="object-fit: contain;">
        </div>
        <h1>${title}</h1>
        <p>${message}</p>
        <br><br>
        <a href="https://xinteck.co.ke">← Return to Xinteck</a>
    </div>
</body>
</html>`;
}
