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
            const [optionsSetting, phonesSetting] = await Promise.all([
                prisma.siteSetting.findUnique({ where: { key: "contact_options" } }),
                prisma.siteSetting.findUnique({ where: { key: "CONTACT_PHONES" } })
            ]);

            if (!optionsSetting?.isPublic) return null;

            const options = JSON.parse(optionsSetting?.value || "{}");
            const phones = phonesSetting?.isPublic ? JSON.parse(phonesSetting.value) : [];

            return {
                ...options,
                phones
            };
        } catch (error) {
            console.error("Failed to fetch contact config:", error);
            return null;
        }
    },
    ["contact-config"],
    { tags: ["site-settings"] }
);

