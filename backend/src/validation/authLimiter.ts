import rateLimiter from "express-rate-limit";

export const authLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
})