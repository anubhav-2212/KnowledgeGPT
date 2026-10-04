import { generateAnswer, generateAnswerStream } from "./generation.service.js";
import { retrieveRelevantChunks } from "./retrieval.service.js";

export const ragQuery = async (question, knowledgeBaseId) => {
    const { results, context } = await retrieveRelevantChunks(question, knowledgeBaseId);
    const answer = await generateAnswer(question, context);
    return { answer, results };
};

export const ragQueryStream = async (question, knowledgeBaseId) => {
    const { results, context } = await retrieveRelevantChunks(question, knowledgeBaseId);
    const stream = await generateAnswerStream(question, context);
    return { stream, results, context };
};