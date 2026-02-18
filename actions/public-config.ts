"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export type ContactConfig = {
    services: string[];
    budgets: Record<string, string[]>;
    phones?: { label: string; value: string }[];
}

export const getContactConfig = unstable_cache(
    async (): Promise<ContactConfig | null> => {
        try {
            const [optionsSetting, phonesSetting] = await Promise.all([
                prisma.siteSetting.findUnique({ where: { key: "contact_options" } }),
                prisma.siteSetting.findUnique({ where: { key: "contact_phones" } })
            ]);

            if (!optionsSetting?.isPublic) return null;

            const options = JSON.parse(optionsSetting?.value || "{}");
            const phones = phonesSetting?.isPublic ? JSON.parse(phonesSetting.value) : [];

            console.log("DEBUG: getContactConfig fetched:", { phonesCount: phones.length, phones });

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
