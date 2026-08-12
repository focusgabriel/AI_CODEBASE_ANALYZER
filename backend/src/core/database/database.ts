import mongoose from "mongoose";
import { env } from "../config/env.js";
import { logger } from "../logger/logger.js";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info("MongoDB connected.");
  } catch (error) {
    logger.fatal(error, "MongoDB connection failed.");
    process.exit(1);
  }
};
