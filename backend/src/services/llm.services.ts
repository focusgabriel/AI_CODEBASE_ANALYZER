import { gemini } from "../config/gemini.js";
import { buildPrompt } from "./prompt-builder.services.js";

export async function generateReport(
    summary: any,
) {
    const prompt = buildPrompt(summary);

    const response = await gemini.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
    });

    return response.text;
}