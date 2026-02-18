import { getSettings } from "@/actions/settings";
import { getSiteSettingCategories, getSiteSettings } from "@/actions/site-settings";
import { RoleGate } from "@/components/admin/RoleGate";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { SiteSettingsTab } from "@/components/admin/SiteSettingsTab";
import { requireRole } from "@/lib/auth-check";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    await requireRole([Role.SUPER_ADMIN]);

    const [settings, siteSettings, categories] = await Promise.all([
        getSettings(),
        getSiteSettings(),
        getSiteSettingCategories(),
    ]);

    return (
        <RoleGate allowedRoles={[Role.SUPER_ADMIN]}>
            <div className="flex flex-col gap-6 md:gap-10 max-w-[1600px] mx-auto w-full">
                <SettingsForm initialSettings={settings} />
                
                {/* Divider */}
                <div className="border-t border-[var(--admin-border)]" />
                
                <SiteSettingsTab 
                    initialSettings={siteSettings as any}
                    categories={categories}
                />
            </div>
        </RoleGate>
    );
}
