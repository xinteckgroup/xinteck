import { INTERNAL_getSecret } from "@/actions/settings";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { NotificationService } from "@/lib/services/notification-service";
import { NotificationPriority, NotificationType, Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email("A valid email address is required to join the squad."),
});

export async function POST(req: Request) {
  try {
    const rawData = await req.json();

    // 1. Validation
    const validation = newsletterSchema.safeParse(rawData);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // 2. Database Logic (Idempotent Upsert)
    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {
        isActive: true,
        unsubscribedAt: null
      },
      create: {
        email,
        source: "website-footer",
      }
    });

    // 3. Audit Log & Notifications
    await logAudit({
      action: "newsletter.subscribe",
      entity: "NewsletterSubscriber",
      entityId: subscriber.id,
      metadata: { email }
    });

    await NotificationService.broadcastToRoles({
      roles: [Role.SUPER_ADMIN, Role.ADMIN],
      title: "New Newsletter Subscriber",
      message: `${email} has joined the laboratory frequency.`,
      type: NotificationType.SUCCESS,
      priority: NotificationPriority.NORMAL,
      link: "/admin/newsletter"
    });

    // 4. Resend Audience Integration (using encrypted secrets)
    try {
      const apiKey = await INTERNAL_getSecret("RESEND_API_KEY");
      const audienceId = await INTERNAL_getSecret("RESEND_AUDIENCE_ID");

      if (apiKey && audienceId) {
        await fetch("https://api.resend.com/audiences/" + audienceId + "/contacts", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            unsubscribed: false
          })
        });
      }
    } catch (err) {
      console.error("Newsletter Subscription Error:", err);
    }

    return NextResponse.json(
      {
        message: "Welcome to the vanguard. You'll receive our monthly lab reports soon.",
        status: "success"
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Newsletter API Error:", error);
    return NextResponse.json(
      { error: "Connection to the frequency was lost. Please try again." },
      { status: 500 }
    );
  }
}
