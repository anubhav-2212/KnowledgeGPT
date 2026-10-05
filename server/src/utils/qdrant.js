import { QdrantClient } from "@qdrant/js-client-rest";
import "dotenv/config";

export const qdrant = process.env.QDRANT_URL
    ? new QdrantClient({
          url: process.env.QDRANT_URL,
          apiKey: process.env.QDRANT_API_KEY,
      })
    : new QdrantClient({
          host: process.env.QDRANT_HOST || "localhost",
          port: process.env.QDRANT_PORT || 6333,
          apiKey: process.env.QDRANT_API_KEY,
      });
 