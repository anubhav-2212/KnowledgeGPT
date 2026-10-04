import { embedText } from "./embedding.service.js";
import { searchVectors } from "./qdrant.service.js";

export const retrieveRelevantChunks = async (question, knowledgeBaseId, limit = 5) => {
    const queryVector = await embedText(question);

    const results = await searchVectors(queryVector, knowledgeBaseId, limit);
    const context = (results || [])
        .map((result) => result.payload?.content)
        .filter(Boolean)
        .join("\n\n---\n\n");

    return { results: results || [], context };
};