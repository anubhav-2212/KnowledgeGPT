import { QdrantClient } from "@qdrant/js-client-rest";
import "dotenv/config"
export const qdrant = new QdrantClient({
    host: process.env.QDRANT_HOST,
    port: process.env.QDRANT_PORT,
    apiKey: process.env.QDRANT_API_KEY,
    
}); 