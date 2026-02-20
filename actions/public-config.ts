"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export type ContactConfig = {
    services: string[];
    budgets: Record<string, string[]>;
    phones?: { label: string; value: string }[];
}

export type BusinessContact = {
    email: string;
    phone: string;
}

export const getBusinessContact = unstable_cache(
    async (): Promise<BusinessContact> => {
        try {
            const [emailSetting, phoneSetting] = await Promise.all([
                prisma.siteSetting.findUnique({ where: { key: "BUSINESS_EMAIL" } }),
                prisma.siteSetting.findUnique({ where: { key: "BUSINESS_PHONE" } }),
            ]);

            return {
                email: emailSetting?.isPublic ? emailSetting.value : "info@xinteck.co.ke",
                phone: phoneSetting?.isPublic ? phoneSetting.value : "+254 782 063 736",
            };
        } catch (error) {
            console.error("Failed to fetch business contact:", error);
            return { email: "info@xinteck.co.ke", phone: "+254 782 063 736" };
        }
    },
    ["business-contact"],
    { tags: ["site-settings"] }
);

export const getContactConfig = unstable_cache(
    async (): Promise<ContactConfig | null> => {
        try {
            // Fetch phones settings and active services in parallel
            const [phonesSetting, activeServices] = await Promise.all([
                prisma.siteSetting.findUnique({ where: { key: "CONTACT_PHONES" } }),
                prisma.service.findMany({
                    where: { isActive: true },
                    orderBy: { sortOrder: 'asc' },
                    select: { name: true, budgetRanges: true }
                })
            ]);

            const phones = phonesSetting?.isPublic ? JSON.parse(phonesSetting.value) : [];

            // Dynamically construct the services and budgets config maps
            const servicesList: string[] = [];
            const budgetsMap: Record<string, string[]> = {};

            activeServices.forEach(s => {
                servicesList.push(s.name);
                budgetsMap[s.name] = s.budgetRanges && s.budgetRanges.length > 0
                    ? s.budgetRanges
                    : ["$10k - $25k", "$25k - $50k", "$50k - $100k", "$100k+"]; // Fallback
            });

            // Add standard options for edge cases
            servicesList.push("Other");
            budgetsMap["Other"] = ["$10k - $25k", "$25k - $50k", "$50k - $100k", "$100k+"];

            return {
                services: servicesList,
                budgets: budgetsMap,
                phones
            };
        } catch (error) {
            console.error("Failed to fetch contact config:", error);
            return null;
        }
    },
    ["contact-config", "active-services"],
    { tags: ["site-settings", "services"] } // Ensure it updates when services change
);

