
import { GoogleGenAI, Type } from "@google/genai";
import type { GeminiOutput, Requirement } from "../types";
import { PROMPT_TEMPLATE, REQUIREMENTS_JSON_SCHEMA } from "../constants";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const generateMarkdownContent = async (userInput: string, imagePart?: { inlineData: { mimeType: string; data: string } }) => {
    const model = 'gemini-2.5-flash';
    const prompt = `${PROMPT_TEMPLATE}\n\nHere is the user's raw input. Analyze it and generate the full requirements document in MARKDOWN format as specified:\n\n---\n\n${userInput}`;
    
    const contents = imagePart ? { parts: [ { text: prompt }, imagePart ] } : prompt;
    
    const response = await ai.models.generateContent({
        model,
        contents,
    });
    return response.text;
};

const generateJsonContent = async (userInput: string, imagePart?: { inlineData: { mimeType: string; data: string } }) => {
    const model = 'gemini-2.5-flash';
    const prompt = `${PROMPT_TEMPLATE}\n\nHere is the user's raw input. Analyze it and extract the requirements into the specified JSON structure. Output ONLY the JSON object, with no additional text or markdown formatting.\n\n---\n\n${userInput}`;

    const contents = imagePart ? { parts: [ { text: prompt }, imagePart ] } : prompt;

    const response = await ai.models.generateContent({
        model,
        contents,
        config: {
            responseMimeType: "application/json",
            responseSchema: REQUIREMENTS_JSON_SCHEMA,
        },
    });

    try {
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        // Quick validation to ensure it has the expected structure
        if (parsedJson && Array.isArray(parsedJson.requirements)) {
            return parsedJson.requirements as Requirement[];
        }
        return [];
    } catch (e) {
        console.error("Failed to parse JSON response from Gemini:", e);
        console.error("Raw JSON string:", response.text);
        // Fallback or attempt to fix common issues if necessary
        return [];
    }
};

export const generateRequirements = async (userInput: string, imageBase64?: string): Promise<GeminiOutput> => {
    let imagePart;
    if (imageBase64) {
        const [header, data] = imageBase64.split(',');
        if (header && data) {
            const mimeTypeMatch = header.match(/data:(.*?);/);
            const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/png';
            imagePart = { inlineData: { mimeType, data } };
        }
    }
    
    // Run both requests in parallel for efficiency
    const [markdownResult, jsonResult] = await Promise.allSettled([
        generateMarkdownContent(userInput, imagePart),
        generateJsonContent(userInput, imagePart)
    ]);

    if (markdownResult.status === 'rejected') {
        throw new Error(`Failed to generate Markdown: ${markdownResult.reason}`);
    }
    if (jsonResult.status === 'rejected') {
         // We can still proceed with markdown if JSON fails
         console.warn(`Failed to generate JSON: ${jsonResult.reason}`);
    }
    
    const markdown = markdownResult.value || 'Error: Could not generate markdown content.';
    const requirements = jsonResult.status === 'fulfilled' ? jsonResult.value : [];
    
    return { markdown, requirements };
};
