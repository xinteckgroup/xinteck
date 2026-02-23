"use server";

import { requireRole } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { validateInput } from "@/lib/ai/guard";
import { PROJECT_DRAFT_PROMPT, PROJECT_SCOUT_PROMPT } from "@/lib/ai/project-config";
import { generateJSON, generateText } from "@/lib/ai/provider";
import { checkRateLimit } from "@/lib/ai/ratelimit";

// ─── VALIDATION SCHEMAS ───

const ProjectScoutResponseSchema = z.array(z.object({
    title: z.string(),
    angle: z.string(),
    client: z.string().optional(),
    businessValueScore: z.number().optional().default(80)
}));

// ─── IDEA GENERATION (SCOUT) ───

export async function scoutProjectIdeas() {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);

    // Rate Limit protection
    await checkRateLimit(user.id);

    const prompt = PROJECT_SCOUT_PROMPT;

    // Guardrail Input
    const inputCheck = validateInput(prompt);
    if (!inputCheck.valid) throw new Error(inputCheck.error);

    // Call Gemini
    const rawIdeas = await generateJSON(prompt);

    // Validate Response Structure
    const validation = ProjectScoutResponseSchema.safeParse(rawIdeas);
    if (!validation.success) {
        console.error("AI Schema Validation Failed:", validation.error);
        throw new Error("AI returned invalid data structure for Projects. Please try again.");
    }

    const validIdeas = validation.data;

    // Process & Score mapped to ProjectIdea Model
    const processedIdeas = validIdeas.map((idea) => {
        return {
            ...idea,
            score: idea.businessValueScore || 80,
            scoreDebug: { source: "Gemini Heuristics" }
        };
    });

    return processedIdeas.sort((a, b) => b.score - a.score);
}

// ─── IDEA MANAGEMENT ───

export async function bulkSaveProjectIdeas(ideas: any[]) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);

    if (!Array.isArray(ideas) || ideas.length === 0) return { count: 0 };

    const validIdeas = ideas.map(idea => ({
        title: String(idea.title).slice(0, 150),
        angle: String(idea.angle).slice(0, 500),
        client: idea.client ? String(idea.client).slice(0, 100) : null,
        score: Number(idea.score) || 0,
        scoreDebug: idea.scoreDebug ? JSON.stringify(idea.scoreDebug) : undefined,
        status: "NEW" as any
    }));

    const result = await prisma.projectIdea.createMany({
        data: validIdeas,
        skipDuplicates: true
    });

    revalidatePath("/admin/projects/ai");
    return { success: true, count: result.count };
}

export async function getProjectIdeas() {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);

    return await prisma.projectIdea.findMany({
        orderBy: { score: 'desc' },
        take: 50 // Limit to top 50
    });
}


export async function deleteProjectIdeaBulk(ids: string[]) {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);

    await prisma.projectIdea.deleteMany({
        where: { id: { in: ids } }
    });

    revalidatePath("/admin/projects/ai");
}

export async function updateProjectIdea(id: string, data: { title: string, angle: string, client?: string }) {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);

    const idea = await prisma.projectIdea.update({
        where: { id },
        data: {
            title: data.title,
            angle: data.angle,
            client: data.client
        }
    });

    revalidatePath("/admin/projects/ai");
    return idea;
}

// ─── CONTENT DRAFTING ───

export async function generateProjectDraft(ideaId: string) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);

    await checkRateLimit(user.id);

    const idea = await prisma.projectIdea.findUnique({ where: { id: ideaId } });
    if (!idea) throw new Error("Idea not found");

    const prompt = PROJECT_DRAFT_PROMPT
        .replace("{title}", idea.title)
        .replace("{angle}", idea.angle)
        .replace("{client}", idea.client || "Generic Enterprise Client");

    const inputCheck = validateInput(prompt);
    if (!inputCheck.valid) throw new Error(inputCheck.error);

    const draft = await generateText(prompt);

    // Create Draft Project
    let slug = idea.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    // Ensure slug uniqueness
    const existing = await prisma.project.count({ where: { slug: { startsWith: slug } } });
    if (existing > 0) slug = `${slug}-${existing + 1}`;

    const newProject = await prisma.project.create({
        data: {
            title: idea.title,
            slug,
            description: idea.angle, // Use angle as excerpt
            content: draft,
            client: idea.client || "TBD",
            authorId: user.id,
            status: "IN_REVIEW",
            category: "WEB_DEV" // Default, admin will change
        }
    });

    // Mark Idea as Drafted
    await prisma.projectIdea.update({
        where: { id: idea.id },
        data: { status: "DRAFTED" }
    });

    return { projectId: newProject.id };
}
