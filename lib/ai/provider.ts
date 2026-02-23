import { INTERNAL_getSecret } from "@/actions/settings";
import { GoogleGenerativeAI } from "@google/generative-ai";
const MODEL_NAME = "gemini-2.5-flash";

export async function getGeminiModel() {
    const apiKey = await INTERNAL_getSecret("GEMINI_API_KEY");

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured in System Settings.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: MODEL_NAME });
}

export async function generateText(prompt: string, temperature = 0.7, useSearchGrounding = false): Promise<string> {
    try {
        const model = await getGeminiModel();

        const req: any = {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                temperature,
                maxOutputTokens: 8192,
            }
        };

        if (useSearchGrounding) {
            req.tools = [{ googleSearch: {} }];
        }

        const result = await model.generateContent(req);

        const response = result.response;
        return response.text();
    } catch (error: any) {
        console.error("Gemini Generation Error:", error);
        throw new Error(`AI Generation Failed: ${error.message}`);
    }
}

export async function generateJSON(prompt: string, useSearchGrounding = false): Promise<any> {
    const model = await getGeminiModel();

    const jsonPrompt = `${prompt}
    
    IMPORTANT: Respond with pure JSON only. Do not wrap in markdown code blocks like \`\`\`json. Just the raw JSON object/array.`;

    try {
        const req: any = {
            contents: [{ role: "user", parts: [{ text: jsonPrompt }] }],
            generationConfig: {
                temperature: 0.4, // Lower temp for structured data
                responseMimeType: "application/json"
            }
        };

        if (useSearchGrounding) {
            req.tools = [{ googleSearch: {} }];
        }

        const result = await model.generateContent(req);

        const text = result.response.text();

        // Safety cleanup if model ignores instruction
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(cleanText);
    } catch (error: any) {
        console.error("Gemini JSON Error:", error);
        throw new Error(`AI JSON Generation Failed: ${error.message}`);
    }
}
