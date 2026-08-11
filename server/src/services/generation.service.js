import { ai } from "../utils/gemini.js";

export const generateAnswer = async (question, context) => {
    const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: `
You are an AI assistant answering questions based on the provided context.

Use the context to answer the question accurately.

If the answer cannot be found in the context, say that you don't have enough information.

Context:
${context}

Question:
${question}
        `,
    });

    return response.text;
};