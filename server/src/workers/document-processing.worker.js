import { Worker } from "bullmq";
import { redisConnection } from "../utils/redis.js";

const worker = new Worker(
    "document-processing",

    async (job) => {

        console.log(job.name);

        console.log(job.data);

    },

    {
        connection: redisConnection,
    }
);

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
    console.log(`Job ${job.id} failed`);
    console.error(err);
});