import { INTERNAL_getSecret } from "@/actions/settings";
import { AdminContactAlertEmail } from "@/components/emails/AdminContactAlertEmail";
import { RoiBreakdownEmail } from "@/components/emails/RoiBreakdownEmail";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { formatKESFull } from "@/lib/roi-calculator";
import { NotificationService } from "@/lib/services/notification-service";
import { NotificationPriority, NotificationType, Role } from "@prisma/client";
import { render } from "@react-email/render";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const roiLeadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Valid phone number is required"),
  company: z.string().optional(),
  mode: z.enum(["efficiency", "revenue"]),
  investmentTier: z.string().min(1),
  investmentAmount: z.number().positive(),
  annualValue: z.number().positive(),
  paybackMonths: z.number().nonnegative(),
  roiPercentage: z.number(),
  honeypot: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const rawData = await req.json();

    // 0. Honeypot Check (Anti-Bot)
    if (rawData.honeypot || rawData.website_url) {
      return NextResponse.json(
        { message: "Your report has been queued.", status: "success" },
        { status: 200 }
      );
    }

    // 1. Validation
    const validation = roiLeadSchema.safeParse(rawData);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      phone,
      company,
      mode,
      investmentTier,
      investmentAmount,
      annualValue,
      paybackMonths,
      roiPercentage,
    } = validation.data;

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // 2. IP Rate Limiting (Prevent spam flooding)
    if (ip !== "unknown") {
      const recentSubmissions = await prisma.contactSubmission.count({
        where: {
          ipAddress: ip,
          createdAt: {
            gte: new Date(Date.now() - 60000), // 1 minute window
          },
        },
      });
      if (recentSubmissions >= 3) {
        return NextResponse.json(
          { error: "Rate limit reached. Please wait a moment before requesting another report." },
          { status: 429 }
        );
      }
    }

    const isEfficiency = mode === "efficiency";
    const modeName = isEfficiency ? "Operational Efficiency & Automation" : "Revenue & Conversion Lift";
    const assignedService = isEfficiency ? "Custom Software Development" : "Web Development";

    const summaryMessage = [
      `[ROI Calculator Lead]`,
      `Mode: ${modeName}`,
      company ? `Company: ${company}` : null,
      `Selected Investment Tier: ${investmentTier} (${formatKESFull(investmentAmount)})`,
      `Projected Annual Value: ${formatKESFull(annualValue)}`,
      `Break-even Payback: ${paybackMonths} months`,
      `Projected ROI: ${Math.round(roiPercentage)}%`,
    ]
      .filter(Boolean)
      .join("\n");

    // 3. Database Record (CRM Lead)
    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone,
        service: assignedService,
        projectType: "ROI Calculator Inquiry",
        industry: company || "General Business",
        budget: formatKESFull(investmentAmount),
        message: summaryMessage,
        ipAddress: ip,
        userAgent: req.headers.get("user-agent") || "unknown",
      },
    });

    // 4. Audit Log
    await logAudit({
      action: "contact.submission",
      entity: "ContactSubmission",
      entityId: submission.id,
      metadata: { email, mode, investmentTier, investmentAmount, annualValue },
    });

    // 5. In-App Notification Broadcast to Admins
    try {
      await NotificationService.broadcastToRoles({
        roles: [Role.SUPER_ADMIN, Role.ADMIN],
        title: "New ROI Calculator Lead",
        message: `${name} generated an ROI report for ${investmentTier} (${formatKESFull(investmentAmount)}).`,
        type: NotificationType.INFO,
        priority: NotificationPriority.HIGH,
        link: `/admin/leads?filter=unread`,
        metadata: { submissionId: submission.id, email },
      });
    } catch (e) {
      console.error("Failed to broadcast ROI lead notification:", e);
    }

    // 6. Email Delivery via Resend
    const resendApiKey = await INTERNAL_getSecret("RESEND_API_KEY");
    const fromEmail = await INTERNAL_getSecret("RESEND_FROM_EMAIL");
    const toEmail = await INTERNAL_getSecret("RESEND_TO_EMAIL");

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);

      // Email 1: Send client their personalized ROI breakdown
      try {
        const clientEmailHtml = await render(
          RoiBreakdownEmail({
            name,
            email,
            phone,
            company,
            mode,
            investmentTier,
            investmentAmount,
            annualValue,
            paybackMonths,
            roiPercentage,
          }) as React.ReactElement
        );

        await resend.emails.send({
          from: fromEmail || "info@xinteck.co.ke",
          to: [email],
          subject: "Your Custom Software ROI Breakdown — Xinteck Technologies",
          html: clientEmailHtml,
        });
      } catch (err) {
        console.error("Failed to send ROI breakdown email to client:", err);
      }

      // Email 2: Send admin team notification
      try {
        const adminEmailHtml = await render(
          AdminContactAlertEmail({
            name,
            email,
            phone,
            projectType: "ROI Calculator Inquiry",
            industry: company || "General Business",
            service: assignedService,
            budget: formatKESFull(investmentAmount),
            message: summaryMessage,
          }) as React.ReactElement
        );

        await resend.emails.send({
          from: fromEmail || "info@xinteck.co.ke",
          to: [toEmail || "admin@xinteck.co.ke"],
          replyTo: email,
          subject: `[ROI Lead] ${name} (${investmentTier})`,
          html: adminEmailHtml,
        });
      } catch (err) {
        console.error("Failed to send ROI alert email to admin:", err);
      }
    } else {
      console.warn("RESEND_API_KEY missing, skipping email dispatch.");
    }

    return NextResponse.json(
      {
        message: "Your ROI breakdown has been emailed successfully.",
        status: "success",
        id: submission.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("ROI Report API Error:", error);
    return NextResponse.json(
      { error: "Could not generate report. Please try again or contact us directly." },
      { status: 500 }
    );
  }
}
