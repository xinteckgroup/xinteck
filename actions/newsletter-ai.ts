"use server";

import { generateJSON, generateText } from "@/lib/ai/provider";
import { requireRole } from "@/lib/auth-check";
import { Role } from "@prisma/client";

const SYSTEM_CONTEXT = `You are the newsletter content assistant for Xinteck, a premium software engineering firm based in Kenya.

Company Profile:
- Services: Web Development, Mobile App Development, Custom Software, UI/UX Design, Cloud & DevOps
- Audience: Tech leaders, CTOs, startup founders, business decision-makers
- Brand voice: Professional yet modern, tech-forward, confident, innovative
- Website: xinteck.co.ke

Rules:
- Never use spammy language (FREE!!!, ACT NOW, LIMITED TIME, etc.)
- Keep content professional and value-driven
- Focus on insights, not sales pitches
- Use clear, concise language suitable for busy professionals
- Include actionable takeaways when possible`;

/**
 * Generate a full newsletter draft from a topic and key points.
 */
export async function generateNewsletterDraft(input: {
    topic: string;
    keyPoints?: string;
    tone?: "professional" | "casual" | "technical" | "inspiring";
}) {
    await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    const toneMap = {
        professional: "formal and authoritative, suitable for C-suite executives",
        casual: "friendly and conversational, approachable yet knowledgeable",
        technical: "in-depth and precise, suitable for senior engineers",
        inspiring: "motivational and forward-thinking, suitable for visionary leaders",
    };

    const toneDesc = toneMap[input.tone || "professional"];

    const prompt = `${SYSTEM_CONTEXT}

Generate a newsletter email body about: "${input.topic}"

${input.keyPoints ? `Key points to cover:\n${input.keyPoints}` : ""}

Tone: ${toneDesc}

Requirements:
- Write in clean HTML suitable for email rendering
- Use <h2> for section headings, <p> for paragraphs, <ul>/<li> for lists
- Keep total length between 300-600 words
- Include 2-3 distinct sections with clear headings
- End with a clear call-to-action
- Do NOT include subject line, greeting, or sign-off — only the body content
- Do NOT use markdown — output pure HTML only
- Do NOT include <html>, <head>, <body>, or <style> tags — just the content HTML`;

    const content = await generateText(prompt, 0.7);
    return { success: true, content };
}

/**
 * Generate 5 subject line variations for a newsletter.
 */
export async function generateSubjectLines(input: { content: string; topic?: string }) {
    await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    const prompt = `${SYSTEM_CONTEXT}

Generate exactly 5 email subject line variations for the following newsletter content.

${input.topic ? `Topic: ${input.topic}` : ""}

Newsletter content (excerpt):
${input.content.substring(0, 1500)}

Return a JSON array of 5 objects with "subject" and "style" fields:
- "subject": the subject line (max 60 characters, no emojis, no spammy words)
- "style": one of "direct", "curiosity", "benefit", "urgency", "question"

Example format:
[{"subject": "How We Cut Deploy Times by 80%", "style": "benefit"}]`;

    const result = await generateJSON(prompt);
    return { success: true, suggestions: result };
}

/**
 * Refine/rewrite existing newsletter content with a specific instruction.
 */
export async function refineContent(input: {
    content: string;
    instruction: string;
}) {
    await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    const prompt = `${SYSTEM_CONTEXT}

Refine the following newsletter content according to this instruction: "${input.instruction}"

Current content:
${input.content}

Requirements:
- Output clean HTML only (no markdown, no <html>/<body> tags)
- Keep the same general structure unless told otherwise
- Maintain professional quality
- Do NOT add spammy or promotional language`;

    const content = await generateText(prompt, 0.6);
    return { success: true, content };
}

/**
 * Generate a compelling preview text (inbox snippet) for a newsletter.
 */
export async function generatePreviewText(input: { subject: string; content: string }) {
    await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    const prompt = `${SYSTEM_CONTEXT}

Generate a compelling email preview text (the snippet shown in inbox preview) for this newsletter.

Subject: ${input.subject}
Content excerpt: ${input.content.substring(0, 500)}

Requirements:
- Maximum 120 characters
- Should complement the subject line, not repeat it
- Should entice the reader to open
- No spammy language
- Return ONLY the preview text, nothing else`;

    const text = await generateText(prompt, 0.6);
    return { success: true, previewText: text.trim().replace(/['"]/g, "") };
}
