import { documentQueue } from "../queues/document-processing.queues.js";
export const enqueueDocumentProcessing = async (sourceId) => {
    await documentQueue.add(
        "process-document",
        { sourceId },
        {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 5000,
            },
            removeOnComplete: 100,
            removeOnFail: 500,
        }
    );
};