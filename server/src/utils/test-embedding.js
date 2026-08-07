import "dotenv/config";
import { embedText } from "../services/embedding.service.js";

const vector = await embedText("React is a JavaScript library.");

console.log(vector.length);
console.log(vector.slice(0, 5));