import "dotenv/config";
import { retrieveRelevantChunks } from "./retrieval.service.js";

const results = await retrieveRelevantChunks(
    "What is React?",
    5
);

console.log("Retrieved:", results.length);

for (const result of results) {
    console.log("\n--------------------");
    console.log("Score:", result.score);
    console.log("Content:", result.payload.content);
    console.log("Source:", result.payload.sourceName);
    console.log("Chunk:", result.payload.chunkIndex);
}