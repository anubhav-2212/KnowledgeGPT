import { ai } from "../utils/gemini.js";

const SYSTEM_INSTRUCTIONS = `
You are KnowledgeGPT, an expert AI assistant that answers questions based on knowledge base documents.
Provide well-structured, clear answers using Markdown (headings, lists, bold text, code blocks).
Answer using the provided context whenever possible.
If the answer cannot be found in the context or if context is missing, politely explain that the current knowledge base documents do not contain that information, and state what was or wasn't found.
`;

export const generateAnswer = async (question, context) => {
    const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: `
${SYSTEM_INSTRUCTIONS}

Context:
${context || "No relevant context found in this knowledge base."}

Question:
${question}
        `,
    });

    return response.text;
};

export const generateAnswerStream = async (question, context) => {
    const stream = await ai.models.generateContentStream({
        model: "gemini-flash-latest",
        contents: `
${SYSTEM_INSTRUCTIONS}

Context:
${context || "No relevant context found in this knowledge base."}

Question:
${question}
        `,
    });

    return stream;
};