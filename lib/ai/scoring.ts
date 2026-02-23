import { prisma } from "@/lib/prisma";
import { CORE_NICHES, SCORING_WEIGHTS, SECONDARY_NICHES } from "./config";

export interface ScoreResult {
    total: number;
    breakdown: {
        relevance: number;
        seo: number;
        authority: number;
        novelty: number;
        clarity: number;
    };
}

export async function calculateScore(idea: { title: string; angle: string; keywords: string[] }): Promise<ScoreResult> {
    const relevance = calculateRelevance(idea);
    const seo = calculateSEO(idea);
    const authority = calculateAuthority(idea);
    const novelty = await calculateNovelty(idea); // Now checks DB collisions
    const clarity = calculateClarity(idea);

    const total = Math.round(
        (relevance * SCORING_WEIGHTS.relevance) +
        (seo * SCORING_WEIGHTS.seo) +
        (authority * SCORING_WEIGHTS.authority) +
        (novelty * SCORING_WEIGHTS.novelty) +
        (clarity * SCORING_WEIGHTS.clarity)
    );

    return {
        total,
        breakdown: { relevance, seo, authority, novelty, clarity }
    };
}

function calculateRelevance(idea: { title: string; angle: string; keywords: string[] }): number {
    let score = 0;
    const allNiches = [...CORE_NICHES, ...SECONDARY_NICHES].map(n => n.toLowerCase());
    const text = (idea.title + " " + idea.angle).toLowerCase();

    // Check for direct niche keyword overlap
    for (const niche of allNiches) {
        const words = niche.split(" ");
        for (const word of words) {
            if (word.length > 3 && text.includes(word)) {
                score += 15;
            }
        }
    }

    // Check keywords overlap
    idea.keywords.forEach(k => {
        if (allNiches.some(n => n.includes(k.toLowerCase()))) {
            score += 10;
        }
    });

    return Math.min(100, score);
}

function calculateSEO(idea: { keywords: string[] }): number {
    let score = 0;

    // Intent words
    const intentWords = ["guide", "how to", "best practices", "strategy", "architecture", "optimization", "vs", "comparison"];
    const keywordsString = idea.keywords.join(" ").toLowerCase();

    if (intentWords.some(w => keywordsString.includes(w))) score += 20;

    // Keyword density check
    if (idea.keywords.length >= 3) score += 30;
    if (idea.keywords.length >= 5) score += 20;

    // Long-tail check (keywords with > 2 words)
    const longTailCount = idea.keywords.filter(k => k.split(" ").length > 2).length;
    score += (longTailCount * 15);

    return Math.min(100, score);
}

function calculateAuthority(idea: { title: string; angle: string }): number {
    let score = 50; // Base score
    const text = (idea.title + " " + idea.angle).toLowerCase();

    const expertTerms = ["scalable", "enterprise", "architecture", "pattern", "strategy", "engineering", "system design", "infrastructure"];
    const beginnerTerms = ["easy", "simple", "beginner", "introduction", "basics", "tutorial", "learn"];

    expertTerms.forEach(t => { if (text.includes(t)) score += 10; });
    beginnerTerms.forEach(t => { if (text.includes(t)) score -= 15; });

    return Math.max(0, Math.min(100, score));
}

async function calculateNovelty(idea: { title: string }): Promise<number> {
    let score = 90;

    // Fast-fail generic structures
    if (idea.title.startsWith("Top 10")) score -= 50;
    if (idea.title.startsWith("5 Best") || idea.title.startsWith("10 Best")) score -= 40;

    // Isolate key title terms
    const titleWords = idea.title
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .split(" ")
        .filter(w => w.length > 4);

    if (titleWords.length === 0) return Math.max(0, score);

    try {
        // Enforce true Database-derived Novelty
        const [blogCollisions, projectCollisions] = await Promise.all([
            prisma.blogPost.count({
                where: { OR: titleWords.map(word => ({ title: { contains: word, mode: "insensitive" } })) }
            }),
            prisma.project.count({
                where: { OR: titleWords.map(word => ({ title: { contains: word, mode: "insensitive" } })) }
            })
        ]);

        const totalCollisions = blogCollisions + projectCollisions;

        if (totalCollisions > 0) {
            // Linearly scale down score based on collision gravity. Max penalty of -40 for structural similarity.
            score -= Math.min(40, totalCollisions * 10);
        }
    } catch (e) {
        console.warn("Could not compute AI DB novelty collision:", e);
    }

    return Math.max(0, score);
}

function calculateClarity(idea: { title: string }): number {
    if (idea.title.length < 20) return 30; // Too short
    if (idea.title.length > 100) return 60; // Too long

    // Specificity check
    if (idea.title.includes("Things")) return 40;

    return 100;
}
