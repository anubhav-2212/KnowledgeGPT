import { Worker } from "bullmq";
import { redisConnection } from "../utils/redis.js";
import connectDB from "../utils/mongoDb.js";
import { processDocument } from "../services/document-processing.service.js";

// Connect to MongoDB once when the worker starts
await connectDB();

const worker = new Worker(
  "document-processing",
  async (job) => {
    await processDocument(job.data.sourceId);
  },
  {
    connection: redisConnection,
  }
);

// Event Listeners
worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed`);
  console.error(err);
});

console.log("🚀 Document Processing Worker Started");