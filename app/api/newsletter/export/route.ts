import { getCurrentUser } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

/**
 * GET /api/newsletter/export
 * Exports all newsletter subscribers as a CSV file.
 * Requires SUPER_ADMIN or ADMIN role.
 */
export async function GET() {
    try {
        // Auth check — API routes can't use redirect(), so we return 401
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!([Role.SUPER_ADMIN, Role.ADMIN] as Role[]).includes(user.role)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Fetch all subscribers (excluding soft-deleted)
        const subscribers = await prisma.newsletterSubscriber.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: "desc" },
        });

        // Build CSV
        const csvHeader = "Email,Status,Source,Subscribed At,Unsubscribed At";
        const csvRows = subscribers.map((sub) => {
            const status = sub.isActive ? "Active" : "Unsubscribed";
            const source = sub.source || "Website";
            const subscribedAt = sub.createdAt.toISOString().split("T")[0];
            const unsubscribedAt = sub.unsubscribedAt
                ? sub.unsubscribedAt.toISOString().split("T")[0]
                : "";

            // Escape email in case it contains commas
            const escapedEmail = sub.email.includes(",") ? `"${sub.email}"` : sub.email;

            return `${escapedEmail},${status},${source},${subscribedAt},${unsubscribedAt}`;
        });

        const csv = [csvHeader, ...csvRows].join("\n");
        const filename = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;

        return new NextResponse(csv, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error("Newsletter Export Error:", error);
        return NextResponse.json(
            { error: "Failed to export subscribers." },
            { status: 500 }
        );
    }
}
