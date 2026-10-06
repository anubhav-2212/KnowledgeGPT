import {qdrant} from "../utils/qdrant.js";
import "dotenv/config";

const COLLECTION_NAME = process.env.QDRANT_COLLECTION_NAME;

export const ensureCollection = async (vectorSize) => {
    const exists = await qdrant.collectionExists(COLLECTION_NAME);

    if (!exists.exists) {
        await qdrant.createCollection(COLLECTION_NAME, {
            vectors: {
                size: vectorSize,
                distance: "Cosine",
            },
        });
        console.log("Collection created");
    }

    // Ensure payload index on knowledgeBaseId for fast filtering
    try {
        await qdrant.createPayloadIndex(COLLECTION_NAME, {
            field_name: "knowledgeBaseId",
            field_schema: "keyword",
            wait: true,
        });
    } catch {
        // Index already exists or supported
    }
};

export const upsertVectors = async (vectors) => {
    await qdrant.upsert(COLLECTION_NAME, {
        wait: true,
        points: vectors,
    });
};

export const searchVectors = async (queryVector, knowledgeBaseId, limit = 5) => {
    try {
        const exists = await qdrant.collectionExists(COLLECTION_NAME);
        if (!exists.exists) {
            return [];
        }

        const res = await qdrant.query(COLLECTION_NAME, {
            query: queryVector,
            limit,
            with_payload: true,
            filter: {
                must: [
                    {
                        key: "knowledgeBaseId",
                        match: {
                            value: knowledgeBaseId.toString(),
                        },
                    },
                ],
            },
        });
        return res.points || [];
    } catch (error) {
        console.error("searchVectors error:", error.message);
        return [];
    }
};

export const deleteVectors = async (ids) => {
    return await qdrant.delete(COLLECTION_NAME, {
        points: ids,
    });
};
