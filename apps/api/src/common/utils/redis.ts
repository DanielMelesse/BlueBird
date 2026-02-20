import crypto from "node:crypto";
import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379");

export async function withLock(
  key: string,
  ttlSeconds: number,
  callback: () => Promise<unknown>
): Promise<unknown> {
  const lockValue = crypto.randomUUID();
  const locked = await redis.set(key, lockValue, "EX", ttlSeconds, "NX");

  if (locked !== "OK") {
    throw new Error("Resource is currently locked");
  }

  try {
    return await callback();
  } finally {
    const current = await redis.get(key);
    if (current === lockValue) {
      await redis.del(key);
    }
  }
}
