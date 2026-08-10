import Source from "../models/Source.models.js";
import { Chunk } from "../models/chunks.models.js";
import { embedText } from "./embedding.service.js";
import { upsertVectors, ensureCollection } from "./qdrant.service.js";

export const processDocument = async (sourceId) => {
    //Find the source
    const source = await Source.findById(sourceId);
    if (!source) {
        throw new Error("Source not found");
    }
    //Updating the status of the document
    source.status = "processing";
    await source.save();
    
    //  Fetch all chunks
    const chunks = await Chunk.find({
        sourceId: source._id,
    }).sort({ chunkIndex: 1 });
    //Check if chunks are found
    if (chunks.length === 0) {
        throw new Error("No chunks found");
    }
    //Generate embedding for each chunk
    const vectors = [];
    for (const chunk of chunks) {
    const embeddingVector = await embedText(chunk.content);
    vectors.push({
        id: chunk._id.toString(),
        vector: embeddingVector,
    payload: {
        sourceId: source._id.toString(),
        knowledgeBaseId: source.knowledgeBaseId.toString(),
        userId: source.userId.toString(),
        chunkIndex: chunk.chunkIndex,
        content: chunk.content,
        sourceType:source.type,
        sourceName:source.name,
    },
     
    });
    }
    //Ensure collection exists in Qdrant
    const vectorSize=vectors[0].vector.length;
    console.log("Vector size: ",vectorSize);
    await ensureCollection(vectorSize);
    
    //Upsert vectors into Qdrant
    await upsertVectors(vectors);
    
    //Update source status to ready
    source.status = "ready";
    await source.save();
    
return {
    source,
    chunks,
};

};