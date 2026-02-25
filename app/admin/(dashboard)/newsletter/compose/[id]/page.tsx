import { getCampaign } from "@/actions/newsletter-campaigns";
import { CampaignComposer } from "@/components/admin/newsletter/CampaignComposer";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditCampaignPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const campaign = await getCampaign(id);

    if (!campaign) {
        redirect("/admin/newsletter/campaigns");
    }

    return (
        <CampaignComposer
            campaignId={campaign.id}
            initialData={{
                subject: campaign.subject,
                previewText: campaign.previewText || "",
                content: campaign.content,
                audience: campaign.audience,
            }}
        />
    );
}
