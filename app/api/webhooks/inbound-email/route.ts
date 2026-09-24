import { INTERNAL_getSecret } from "@/actions/settings";
import { InboundReplyAlertEmail } from "@/components/emails/InboundReplyAlertEmail";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { NotificationService } from "@/lib/services/notification-service";
import { MessageStatus, NotificationPriority, NotificationType, Role } from "@prisma/client";
import { render } from "@react-email/render";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    // 1. Webhook Secret Authentication (if configured)
    const authHeader = req.headers.get("authorization");
    const configuredSecret = process.env.INBOUND_WEBHOOK_SECRET;
    if (configuredSecret && authHeader !== `Bearer ${configuredSecret}`) {
      const apiKeyHeader = req.headers.get("x-webhook-secret");
      if (apiKeyHeader !== configuredSecret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const payload = await req.json();

    // 2. Normalize Inbound Payload across Resend / Cloudflare / Custom Email Handlers
    // Handle Resend webhook event structure: payload.data or payload root
    const data = payload.data || payload;

    let senderEmail = "";
    let senderName = "";

    if (typeof data.from === "string") {
      // Extract from "Name <email@example.com>" or "email@example.com"
      const match = data.from.match(/(.*)<(.+)>/);
      if (match) {
        senderName = match[1].trim().replace(/^["']|["']$/g, "");
        senderEmail = match[2].trim().toLowerCase();
      } else {
        senderEmail = data.from.trim().toLowerCase();
        senderName = senderEmail.split("@")[0];
      }
    } else if (data.from && typeof data.from === "object") {
      senderEmail = (data.from.email || "").trim().toLowerCase();
      senderName = (data.from.name || senderEmail.split("@")[0]).trim();
    }

    if (!senderEmail || !senderEmail.includes("@")) {
      return NextResponse.json({ error: "Sender email missing in payload" }, { status: 400 });
    }

    // Ignore bounces, auto-responders, and self-sent loops
    if (
      senderEmail.includes("mailer-daemon") ||
      senderEmail.includes("postmaster") ||
      senderEmail.includes("no-reply") ||
      senderEmail.includes("noreply") ||
      senderEmail === "info@xinteck.co.ke"
    ) {
      return NextResponse.json({ message: "Ignored system/automated sender", status: "skipped" });
    }

    const subject = (data.subject || "Re: Inquiry").trim();
    const rawBody = data.text || data.html?.replace(/<[^>]*>?/gm, "") || data.body || "";
    const cleanBody = rawBody.trim() || "[No text body provided]";

    // Extract potential Reference Tag: e.g. [XTK-cl12345] or X-Entity-Ref-ID header
    let refId: string | null = null;
    const headerRef = req.headers.get("x-entity-ref-id") || data.headers?.["x-entity-ref-id"] || data.headers?.["X-Entity-Ref-ID"];
    if (headerRef) {
      refId = String(headerRef).replace(/^#?XTK-/, "").trim();
    }

    if (!refId) {
      const subjectMatch = subject.match(/\[#?(?:XTK-)?([a-zA-Z0-9_\-]+)\]/);
      if (subjectMatch) {
        refId = subjectMatch[1].trim();
      }
    }

    // 3. Match Existing Lead
    let lead = null;

    if (refId) {
      // Try to match lead directly by ID or tracking code
      lead = await prisma.contactSubmission.findFirst({
        where: {
          OR: [
            { id: refId },
            { id: { startsWith: refId } }
          ],
          deletedAt: null
        }
      });
    }

    if (!lead) {
      // Match by sender email (latest active thread)
      lead = await prisma.contactSubmission.findFirst({
        where: {
          email: senderEmail,
          deletedAt: null
        },
        orderBy: { createdAt: "desc" }
      });
    }

    let leadId = "";

    if (lead) {
      leadId = lead.id;

      // 4A. Append to existing conversation
      await prisma.contactReply.create({
        data: {
          submissionId: lead.id,
          content: cleanBody,
          sentBy: `Client (${senderName || senderEmail})`
        }
      });

      // Re-flag lead as UNREAD and restore if archived
      await prisma.contactSubmission.update({
        where: { id: lead.id },
        data: {
          status: MessageStatus.UNREAD,
          isArchived: false,
          updatedAt: new Date()
        }
      });
    } else {
      // 4B. New direct inbound email lead
      const newLead = await prisma.contactSubmission.create({
        data: {
          name: senderName || senderEmail.split("@")[0],
          email: senderEmail,
          phone: "Not Provided",
          projectType: subject || "Direct Inbound Email",
          message: cleanBody,
          status: MessageStatus.UNREAD
        }
      });

      leadId = newLead.id;
    }

    // 5. In-App Notification Broadcast
    try {
      await NotificationService.broadcastToRoles({
        roles: [Role.SUPER_ADMIN, Role.ADMIN],
        title: `New Reply: ${senderName || senderEmail}`,
        message: `${subject}: "${cleanBody.substring(0, 100)}..."`,
        type: NotificationType.INFO,
        priority: NotificationPriority.HIGH,
        link: `/admin/leads?search=${encodeURIComponent(senderEmail)}`,
        metadata: { leadId, senderEmail }
      });
    } catch (notifErr) {
      console.error("Failed to broadcast inbound notification:", notifErr);
    }

    // 6. Fail-Safe Relay to winterjacksonwj@gmail.com
    try {
      const apiKey = await INTERNAL_getSecret("RESEND_API_KEY");
      if (apiKey) {
        const relayHtml = await render(
          InboundReplyAlertEmail({
            clientName: senderName || senderEmail,
            clientEmail: senderEmail,
            subject,
            replyContent: cleanBody,
            leadId,
            receivedAt: new Date().toLocaleString("en-US", { timeZone: "Africa/Nairobi" })
          }) as React.ReactElement
        );

        const resend = new Resend(apiKey);
        await resend.emails.send({
          from: "Xinteck CRM <info@xinteck.co.ke>",
          to: ["winterjacksonwj@gmail.com"],
          replyTo: senderEmail,
          subject: `[Client Reply] ${senderName || senderEmail}: ${subject}`,
          html: relayHtml
        });
      }
    } catch (relayErr) {
      console.error("Failed to relay email copy to winterjacksonwj@gmail.com:", relayErr);
    }

    // 7. Audit Log
    await logAudit({
      action: "contact.inbound_reply",
      entity: "ContactSubmission",
      entityId: leadId,
      metadata: {
        senderEmail,
        senderName,
        subject,
        preview: cleanBody.substring(0, 100)
      }
    });

    return NextResponse.json({
      success: true,
      message: "Inbound reply ingested successfully into CRM",
      leadId
    });
  } catch (err: any) {
    console.error("Error processing inbound email webhook:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
