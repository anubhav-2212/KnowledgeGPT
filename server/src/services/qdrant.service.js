import { qdrant } from "../config/qdrant.js";

const COLLECTION_NAME = "knowledge-base";

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

export const searchVectors = async (queryVector, limit = 5) => {
    return await qdrant.query(COLLECTION_NAME, {
        query: queryVector,
        limit,
    });
};

export const deleteVectors = async (ids) => {
    return await qdrant.delete(COLLECTION_NAME, {
        points: ids,
    });
};
