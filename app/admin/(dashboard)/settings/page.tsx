import { getSettings } from "@/actions/settings";
import { getSiteSettingCategories, getSiteSettings } from "@/actions/site-settings";
import { RoleGate } from "@/components/admin/RoleGate";
import { SettingsForm, type ContactInfo } from "@/components/admin/SettingsForm";
import { SiteSettingsTab } from "@/components/admin/SiteSettingsTab";
import { requireRole } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    await requireRole([Role.SUPER_ADMIN]);

    const [settings, siteSettings, categories] = await Promise.all([
        getSettings(),
        getSiteSettings(),
        getSiteSettingCategories(),
    ]);

    // Fetch contact info for the Contact tab
    const [emailSetting, phoneSetting, phonesSetting] = await Promise.all([
        prisma.siteSetting.findUnique({ where: { key: "BUSINESS_EMAIL" } }),
        prisma.siteSetting.findUnique({ where: { key: "BUSINESS_PHONE" } }),
        prisma.siteSetting.findUnique({ where: { key: "CONTACT_PHONES" } }),
    ]);

    const contactInfo: ContactInfo = {
        businessEmail: emailSetting?.value || "info@xinteck.co.ke",
        businessPhone: phoneSetting?.value || "+254 782 063 736",
        contactPhones: phonesSetting?.value ? (() => { try { return JSON.parse(phonesSetting.value); } catch { return []; }})() : [],
    };

    return (
        <RoleGate allowedRoles={[Role.SUPER_ADMIN]}>
            <div className="flex flex-col gap-6 md:gap-10 max-w-[1600px] mx-auto w-full">
                <SettingsForm initialSettings={settings} initialContactInfo={contactInfo} />
                
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

