import "dotenv/config";
import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { createClient } from "redis";
import type { Request } from "express";

const redisClient = createClient({
  url: process.env.REDIS_URL ?? "redis://localhost:6379",
});

let redisAvailable = false;

try {
  await redisClient.connect();
  redisAvailable = true;
  console.log("Redis connected for rate limiting");
} catch (err) {
  console.warn(
    "Redis connection failed - falling back to in-memory rate limiting:",
    (err as Error).message,
  );
}

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,

  ...(redisAvailable
    ? {
        store: new RedisStore({
          sendCommand: (...args: string[]) => redisClient.sendCommand(args),
          prefix: "rl:",
        }),
      }
    : {}),

  keyGenerator: (req: Request) => req.user?.id ?? req.ip ?? "unknown",

  message: {
    status: 429,
    error: "Too Many Requests",
    message: "You have exceeded the request limit. Please try again later.",
  },
});

// Graceful shutdown
const shutdown = () => {
  if (redisAvailable) {
    redisClient.quit();
  }
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

