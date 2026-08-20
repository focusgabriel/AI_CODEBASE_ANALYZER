import rateLimiter from "express-rate-limit"

export const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

