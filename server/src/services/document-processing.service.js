import Source from "../models/Source.models.js";
import { Chunk } from "../models/chunks.models.js";
import { embedText } from "./embedding.service.js";
import { upsertVectors, ensureCollection } from "./qdrant.service.js";
import crypto from "crypto";

export const processDocument = async (sourceId) => {
    // Find the source
    const source = await Source.findById(sourceId);
    if (!source) {
        console.warn(`[Worker] Source ${sourceId} not found in database (likely deleted by user). Gracefully completing job.`);
        return { skipped: true, reason: "Source deleted" };
    }

    try {
        // Updating the status of the document
        source.status = "processing";
        await source.save();

        // Fetch all chunks
        const chunks = await Chunk.find({
            sourceId: source._id,
        }).sort({ chunkIndex: 1 });

        if (chunks.length === 0) {
            console.warn(`[Worker] No chunks found for source ${sourceId}.`);
            source.status = "failed";
            await source.save();
            return { skipped: true, reason: "No chunks found" };
        }

        // Generate embedding for each chunk
        const vectors = [];
        console.log(`[Worker] Generating embeddings for ${chunks.length} chunks of "${source.sourceName || source._id}"...`);
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const embeddingVector = await embedText(chunk.content);
            vectors.push({
                id: crypto.randomUUID(),
                vector: embeddingVector,
                payload: {
                    chunkID: chunk._id.toString(),
                    sourceId: source._id.toString(),
                    knowledgeBaseId: source.knowledgeBaseId.toString(),
                    userId: source.userId.toString(),
                    chunkIndex: chunk.chunkIndex,
                    content: chunk.content,
                    sourceType: source.sourceType,
                    sourceName: source.sourceName,
                },
            });

            if ((i + 1) % 10 === 0 || i + 1 === chunks.length) {
                console.log(`[Worker] Embedded ${i + 1}/${chunks.length} chunks (${Math.round(((i + 1) / chunks.length) * 100)}%)`);
            }

            // Small throttle (150ms) to stay within API rate limits
            await new Promise((resolve) => setTimeout(resolve, 150));
        }

        // Ensure collection exists in Qdrant
        const vectorSize = vectors[0].vector.length;
        await ensureCollection(vectorSize);

        // Upsert vectors into Qdrant
        await upsertVectors(vectors);

        // Update source status to ready
        source.status = "ready";
        await source.save();

        return {
            source,
            chunks,
        };
    } catch (err) {
        console.error(`[Worker] Failed to process document ${sourceId}:`, err);
        source.status = "failed";
        await source.save().catch(() => {});
        throw err;
    }
};