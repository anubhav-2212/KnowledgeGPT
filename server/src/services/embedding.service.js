import "dotenv/config";
import { ai } from "../utils/gemini.js";

// Embedding candidate models
const CANDIDATE_EMBEDDING_MODELS = [
    "gemini-embedding-2",
    "gemini-embedding-2-preview",
    "gemini-embedding-001",
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate embedding for text chunks
export const embedText = async (text, retries = 3) => {
    let lastError = null;

    for (const model of CANDIDATE_EMBEDDING_MODELS) {
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const response = await ai.models.embedContent({
                    model,
                    contents: text,
                    config: {
                        outputDimensionality: 768,
                    },
                });

                const values = response.embeddings?.[0]?.values || response.embedding?.values;
                if (values && values.length > 0) {
                    return values;
                }
                throw new Error("No embedding values returned in response");
            } catch (error) {
                lastError = error;
                const status = error.status || error.code || error.error?.code;

                // If 404 (model not found), break immediately to try next candidate
                if (status === 404) {
                    break;
                }

                // If 429 (quota or rate limit) or 503 (service unavailable), wait and retry
                if ((status === 429 || status === 503 || error.message?.includes("quota") || error.message?.includes("rate")) && attempt < retries) {
                    const delay = 1500 * Math.pow(2, attempt);
                    console.warn(`[Embedding] Model ${model} rate limited (${status}). Retrying in ${delay}ms...`);
                    await sleep(delay);
                    continue;
                }

                // For other errors or exhausted retries on this model, try next model
                break;
            }
        }
    }

    throw lastError || new Error("Failed to generate embedding with all candidate models");
};