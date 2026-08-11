import {qdrant} from "../utils/qdrant.js";
import "dotenv/config";

const COLLECTION_NAME = process.env.QDRANT_COLLECTION_NAME;

export const ensureCollection = async (vectorSize) => {
    const exists = await qdrant.collectionExists(COLLECTION_NAME);

    if (exists.exists) {
        return;
    }

    await qdrant.createCollection(COLLECTION_NAME, {
        vectors: {
            size: vectorSize,
            distance: "Cosine",
        },
    });

    console.log("Collection created");
};

export const upsertVectors = async (vectors) => {
    await qdrant.upsert(COLLECTION_NAME, {
        wait: true,
        points: vectors,
    });
};

export const searchVectors = async (queryVector, knowledgeBaseId,limit = 5) => {
    const res=await qdrant.query(COLLECTION_NAME, {
        query: queryVector,
        limit,
        with_payload: true,
        filter: {
            must: [
                {
                    key: "knowledgeBaseId",
                    match: {
                        value: knowledgeBaseId,
                    },
                },
            ],
        },
    });
    return res.points;
};

export const deleteVectors = async (ids) => {
    return await qdrant.delete(COLLECTION_NAME, {
        points: ids,
    });
};
