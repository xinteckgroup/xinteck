
export const PROJECT_SCOUT_PROMPT = `
TASK: GENERATE HYPOTHETICAL PROJECT CASE STUDY CONCEPTS
CONTEXT:
- Target Services: Web Apps, Enterprise Mobile, UI/UX, Cloud Architecture.

INSTRUCTION:
Identify 5 high-impact hypothetical engineering case studies that a premium agency like Xinteck could have completed.
Focus on: The initial challenge, the technical approach (e.g. scaling a SaaS, modernizing legacy systems, building custom Fintech apps), and the massive ROI generated.

OUTPUT JSON FORMAT:
[
  {
    "title": "Specific, catchy but highly professional case study title",
    "angle": "The core technical challenge and solution hook",
    "client": "Hypothetical Industry/Client Type (e.g. Series B Fintech Startup)",
    "businessValueScore": 1-100
  }
]
`;

export const PROJECT_DRAFT_PROMPT = `
TASK: DRAFT CASE STUDY
TOPIC: {title}
ANGLE: {angle}
CLIENT: {client}

INSTRUCTION:
Write a comprehensive, professional, 500-800 word Project Case Study formatted strictly in raw Markdown authored by Xinteck's Engineering Team.

STRUCTURAL REQUIREMENTS:
1. Use ## for main sections and ### for sub-sections.
2. Structure the narrative:
   - The Challenge (Define the business/engineering problem)
   - The Approach (Technical deep dive, architectural patterns showing elite custom engineering)
   - The Results (Business KPIs, Scalability, ROI)

CONSTRAINTS:
- NEVER wrap your response in \`\`\`markdown or \`\`\` blocks. Just return the raw text directly.
- Ensure the word count is strictly between 500 - 800 words. DO NOT produce short outlines.
- Write full, complete paragraphs. DO NOT prematurely cut off or truncate the article.
- No marketing fluff; maintain elite engineering authority.

OUTPUT:
Raw Markdown content ONLY.
`;
