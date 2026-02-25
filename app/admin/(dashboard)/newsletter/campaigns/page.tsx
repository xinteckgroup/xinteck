import { getCampaigns, getCampaignStats } from "@/actions/newsletter-campaigns";
import { CampaignList } from "@/components/admin/newsletter/CampaignList";

export const dynamic = "force-dynamic";

export default async function CampaignsPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; status?: string; page?: string; limit?: string }>;
}) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 12;

    const [campaigns, stats] = await Promise.all([
        getCampaigns({
            page,
            pageSize: limit,
            search: params.search,
            status: params.status,
        }),
        getCampaignStats(),
    ]);

    return <CampaignList initialData={campaigns} stats={stats} />;
}
