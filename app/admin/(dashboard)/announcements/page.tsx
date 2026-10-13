import { getAnnouncements } from "@/actions/announcements";
import { AnnouncementsManager } from "@/components/admin/AnnouncementsManager";

export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
    const announcements = await getAnnouncements();

    return <AnnouncementsManager initialData={announcements} />;
}
