import Source from "../models/Source.models.js";
import { Chunk } from "../models/chunks.models.js";
import { embedText } from "./embedding.service.js";

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
    const embeddings = [];
    for (const chunk of chunks) {
    const vector = await embedText(chunk.content);
    embeddings.push({
        chunkId: chunk._id,
        vector,
    });
    }
    
return {
    source,
    chunks,
};

};