import { Queue } from "bullmq";
import { redisConnection } from "../utils/redis.js";

export const documentQueue = new Queue(
    "document-processing",
    {
        connection: redisConnection,
    }
);