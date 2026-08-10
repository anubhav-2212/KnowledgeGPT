import { embedText } from "./embedding.service.js";
import { searchVectors } from "./qdrant.service.js";

export const retrieveRelevantChunks = async (question, limit = 5) => {
    const queryVector = await embedText(question);

    const results = await searchVectors(queryVector, limit);

    return results;
};