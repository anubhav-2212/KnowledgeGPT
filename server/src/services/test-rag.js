import "dotenv/config";
import { ragQuery } from "./rag.service.js";

const result = await ragQuery(
    "What is React?"
);

console.log("\nANSWER:\n");
console.log(result.answer);

console.log("\nSOURCES:\n");

for (const source of result.results) {
    console.log(source);
}