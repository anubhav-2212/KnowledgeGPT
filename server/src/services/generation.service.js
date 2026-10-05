import { ai } from "../utils/gemini.js";

const SYSTEM_INSTRUCTIONS = `
You are KnowledgeGPT, an expert AI assistant that answers questions based on knowledge base documents.
Provide well-structured, clear answers using Markdown (headings, lists, bold text, code blocks).
Answer using the provided context whenever possible.
If the answer cannot be found in the context or if context is missing, politely explain that the current knowledge base documents do not contain that information, and state what was or wasn't found.
`;

const CANDIDATE_MODELS = [
    "models/gemini-3.5-flash",
    "models/gemini-3.8-flash",
    "models/gemini-flash-lite-latest",
    "models/gemini-flash-latest",
];

export const generateAnswer = async (question, context) => {
    const prompt = `
${SYSTEM_INSTRUCTIONS}

Context:
${context || "No relevant context found in this knowledge base."}

Question:
${question}
    `;

    let lastError = null;
    for (const model of CANDIDATE_MODELS) {
        try {
            const response = await ai.models.generateContent({
                model,
                contents: prompt,
            });
            return response.text;
        } catch (error) {
            console.warn(`Model ${model} failed: ${error.message}. Trying next candidate...`);
            lastError = error;
        }
    }

    throw lastError || new Error("All AI models failed to respond.");
};

export const generateAnswerStream = async (question, context) => {
    const prompt = `
${SYSTEM_INSTRUCTIONS}

Context:
${context || "No relevant context found in this knowledge base."}

Question:
${question}
    `;

    let lastError = null;
    for (const model of CANDIDATE_MODELS) {
        try {
            const stream = await ai.models.generateContentStream({
                model,
                contents: prompt,
            });
            return stream;
        } catch (error) {
            console.warn(`Streaming model ${model} failed: ${error.message}. Trying next candidate...`);
            lastError = error;
        }
    }

    throw lastError || new Error("All streaming AI models failed to respond.");
};