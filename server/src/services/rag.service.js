import { generateAnswer } from "./generation.service.js";
import { retrieveRelevantChunks } from "./retrieval.service.js";

export const ragQuery = async (question) => {
    const {results,context} = await retrieveRelevantChunks(question);
    const answer = await generateAnswer(question, context);
    return {answer,results};
};