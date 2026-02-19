import { INTERNAL_getSecret } from "@/actions/settings";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";


// Remove static init
// const resend = new Resend(process.env.RESEND_API_KEY || "re_123");


const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Valid phone number is required"),
  service: z.string().optional(),
  projectType: z.string().min(1, "Project type is required"), // "I Need To"
  industry: z.string().min(1, "Industry is required"),
  budget: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

import { NotificationService } from "@/lib/services/notification-service";
import { NotificationPriority, NotificationType, Role } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const rawData = await req.json();

    // 1. Validation
    const validation = contactSchema.safeParse(rawData);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, phone, service, projectType, industry, budget, message } = validation.data;

    // 2. Database Transaction (Primary Source of Truth)
    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone,
        service,
        projectType,
        industry,
        budget,
        message,
        ipAddress: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || "unknown",
      }
    });

    // 3. Audit Log
    // Fail-safe (won't block response if fails inside logAudit)
    await logAudit({
      action: "contact.submission",
      entity: "ContactSubmission",
      entityId: submission.id,
      metadata: { email, service, projectType, industry }
    });

    // 4. Notification Broadcast (NEW)
    // Alert Admins and Super Admins
    try {
      await NotificationService.broadcastToRoles({
        roles: [Role.SUPER_ADMIN, Role.ADMIN],
        title: "New Contact Inquiry",
        message: `${name} has sent an inquiry regarding ${projectType} (${industry}).`,
        type: NotificationType.INFO,
        priority: NotificationPriority.HIGH,
        link: `/admin/leads?filter=unread`, // Deep link
        metadata: { submissionId: submission.id, email }
      });
    } catch (e) {
      console.error("Failed to broadcast notification:", e);
    }

    // 5. Resend Integration (Side Effect)
    const resendApiKey = await INTERNAL_getSecret("RESEND_API_KEY");
    const fromEmail = await INTERNAL_getSecret("RESEND_FROM_EMAIL");
    const toEmail = await INTERNAL_getSecret("RESEND_TO_EMAIL");

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);

        await resend.emails.send({
          from: fromEmail || "onboarding@resend.dev",
          to: [toEmail || "admin@xinteck.com"],
          subject: `New Inquiry: ${name} (${projectType})`,
          text: `
            Name: ${name}
            Email: ${email}
            Phone: ${phone}
            
            I Need To: ${projectType}
            Industry: ${industry}
            Service: ${service || "Not specified"}
            Budget: ${budget || "Not specified"}
            
            Message:
            ${message}
            
            Link: https://xinteck.co.ke/admin/leads
          `,
        });
      } catch (err) {
        console.error("Resend Error:", err);
        // Log email failure to console but don't fail request since DB saved
      }
    } else {
      console.warn("RESEND_API_KEY missing, skipping email notification.");
    }

    // SUCCESS RESPONSE
    return NextResponse.json(
      {
        message: "Your inquiry has been launched into our orbit. Our engineers will reach out within 4 hours.",
        status: "success",
        id: submission.id
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { error: "The signal was lost. Please try again or contact us directly." },
      { status: 500 }
    );
  }
}
