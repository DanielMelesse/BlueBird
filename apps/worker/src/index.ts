import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379");
const notificationsQueue = new Queue("notifications", { connection });

void notificationsQueue.add("startup-check", { at: new Date().toISOString() });

new Worker(
  "notifications",
  async (job) => {
    console.log(`[worker] processed job`, job.name, job.id);
  },
  { connection }
);

console.log("Background worker started");
