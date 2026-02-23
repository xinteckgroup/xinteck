"use server";

import { requireRole } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { DRAFT_PROMPT_TEMPLATE, EXCLUSIONS_PROMPT_TEMPLATE, SCOUT_PROMPT_TEMPLATE } from "@/lib/ai/config";
import { injectContext, validateInput, validateOutput } from "@/lib/ai/guard";
import { generateJSON, generateText } from "@/lib/ai/provider";
import { checkRateLimit } from "@/lib/ai/ratelimit";
import { calculateScore } from "@/lib/ai/scoring";

// ─── VALIDATION SCHEMAS ───

const ScoutResponseSchema = z.array(z.object({
    title: z.string(),
    angle: z.string(),
    keywords: z.array(z.string()).optional().default([]),
    reasoning: z.string().optional(),
    sources: z.array(z.string()).optional().default([])
}));

const ExclusionSuggestionSchema = z.array(z.object({
    keyword: z.string(),
    reasoning: z.string()
}));

// ─── SETTINGS MANAGEMENT ───

export async function getAiSettings() {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);
    const setting = await prisma.siteSetting.findUnique({
        where: { key: "ai_config" }
    });

    if (!setting) return null;
    return JSON.parse(setting.value);
}

export async function updateAiSettings(settings: any) {
    const user = await requireRole([Role.SUPER_ADMIN]);

    // Basic validation
    if (!settings.targetNiches || !Array.isArray(settings.targetNiches)) {
        throw new Error("Invalid Niche Configuration");
    }

    await prisma.siteSetting.upsert({
        where: { key: "ai_config" },
        update: {
            value: JSON.stringify(settings),
            updatedById: user.id
        },
        create: {
            key: "ai_config",
            value: JSON.stringify(settings),
            type: "JSON",
            category: "ai",
            description: "Configuration for AI Blog Assistant",
            updatedById: user.id
        }
    });

    revalidatePath("/admin/blog/ai");
}

// ─── IDEA GENERATION (SCOUT) ───

export async function scoutTrends() {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);

    // 1. Rate Limit
    await checkRateLimit(user.id);

    const settings = await getAiSettings();
    if (!settings) throw new Error("AI not configured. Please set up niches first.");

    const prompt = SCOUT_PROMPT_TEMPLATE
        .replace("{niches}", settings.targetNiches.join(", "))
        .replace("{exclusions}", settings.excludedKeywords?.join(", ") || "None");

    // 2. Guardrail Input
    const inputCheck = validateInput(prompt);
    if (!inputCheck.valid) throw new Error(inputCheck.error);

    // 3. Call AI
    const rawIdeas = await generateJSON(prompt);

    // 4. Validate Response Structure
    const validation = ScoutResponseSchema.safeParse(rawIdeas);
    if (!validation.success) {
        console.error("AI Schema Validation Failed:", validation.error);
        throw new Error("AI returned invalid data structure. Please try again.");
    }

    const validIdeas = validation.data;

    // 5. Process & Score
    const processedIdeas = await Promise.all(validIdeas.map(async (idea) => {
        const scoreResult = await calculateScore({
            title: idea.title,
            angle: idea.angle,
            keywords: idea.keywords
        });

        return {
            ...idea,
            score: scoreResult.total,
            scoreDebug: { ...scoreResult.breakdown, sources: idea.sources }
        };
    }));

    return processedIdeas.sort((a, b) => b.score - a.score);
}

// ─── AI CONFIGURATION SUGGESTIONS ───

export async function generateExclusions() {
    const user = await requireRole([Role.SUPER_ADMIN]);

    await checkRateLimit(user.id);

    const settings = await getAiSettings();
    if (!settings) throw new Error("AI not configured. Please set up niches first.");

    const prompt = EXCLUSIONS_PROMPT_TEMPLATE
        .replace("{niches}", settings.targetNiches.join(", "))
        .replace("{brandVoice}", settings.brandVoice || "Professional");

    const inputCheck = validateInput(prompt);
    if (!inputCheck.valid) throw new Error(inputCheck.error);

    const rawOutput = await generateJSON(prompt);
    const validation = ExclusionSuggestionSchema.safeParse(rawOutput);

    if (!validation.success) {
        console.error("AI Exclusion Schema Validation Failed:", validation.error);
        throw new Error("AI returned invalid data structure. Please try again.");
    }

    return validation.data;
}

// ─── IDEA MANAGEMENT ───

export async function saveIdea(ideaData: any) {
    // Single save wrapper for backward compatibility or single actions
    return await bulkSaveIdeas([ideaData]);
}

export async function bulkSaveIdeas(ideas: any[]) {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);

    if (ideas.length === 0) return { success: true, count: 0 };

    // 1. Filter out duplicates based on title
    // Efficiently check existing titles in one query
    const titles = ideas.map(i => i.title);
    const existing = await prisma.blogIdea.findMany({
        where: { title: { in: titles } },
        select: { title: true }
    });

    const existingTitles = new Set(existing.map(e => e.title));
    const newIdeas = ideas.filter(i => !existingTitles.has(i.title));

    if (newIdeas.length === 0) {
        return { success: true, count: 0, message: "All ideas already exist" };
    }

    // 2. Bulk Create
    await prisma.blogIdea.createMany({
        data: newIdeas.map(idea => ({
            title: idea.title,
            angle: idea.angle,
            keywords: idea.keywords,
            score: idea.score,
            scoreDebug: idea.scoreDebug || {},
            status: "APPROVED"
        }))
    });

    revalidatePath("/admin/blog/ai");
    return { success: true, count: newIdeas.length };
}

export async function getIdeas() {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);
    return await prisma.blogIdea.findMany({
        where: { status: "APPROVED" },
        orderBy: { score: "desc" }
    });
}

export async function deleteIdea(id: string) {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);
    await prisma.blogIdea.delete({ where: { id } });
    revalidatePath("/admin/blog/ai");
}

export async function updateIdea(id: string, data: { title: string; angle: string }) {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);
    if (!data.title || !data.angle) throw new Error("Title and angle are required");

    await prisma.blogIdea.update({
        where: { id },
        data: { title: data.title, angle: data.angle }
    });
    revalidatePath("/admin/blog/ai");
}

// ─── DRAFT GENERATION ───

export async function generateDraft(ideaId: string) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);

    // 1. Rate Limit
    await checkRateLimit(user.id);

    const idea = await prisma.blogIdea.findUnique({ where: { id: ideaId } });
    const settings = await getAiSettings();

    if (!idea) throw new Error("Idea not found");
    if (!settings) throw new Error("Settings not found");

    // Construct Prompt
    let prompt = DRAFT_PROMPT_TEMPLATE
        .replace("{title}", idea.title)
        .replace("{angle}", idea.angle)
        .replace("{brandVoice}", settings.brandVoice || "Professional")
        .replace("{keywords}", idea.keywords.join(", "));

    prompt = injectContext(prompt, {
        niches: settings.targetNiches,
        brandVoice: settings.brandVoice
    });

    // Generate
    const content = await generateText(prompt, 0.7);

    // Validate Output
    const outputCheck = validateOutput(content);
    if (!outputCheck.valid) {
        throw new Error(`AI Safety Violation: ${outputCheck.error}`);
    }

    // Create Draft Post
    let slug = idea.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const random = Math.floor(Math.random() * 1000);

    const existingSlug = await prisma.blogPost.findUnique({ where: { slug } });
    if (existingSlug) slug = `${slug}-${random}`;

    const post = await prisma.blogPost.create({
        data: {
            title: idea.title,
            slug,
            content: content, // The raw markdown
            excerpt: idea.angle,
            status: "DRAFT",
            authorId: user.id
        }
    });

    // Update Idea Status
    await prisma.blogIdea.update({
        where: { id: ideaId },
        data: {
            status: "DRAFTED",
            generatedPostId: post.id
        }
    });

    revalidatePath("/admin/blog");
    return { success: true, postId: post.id };
}
