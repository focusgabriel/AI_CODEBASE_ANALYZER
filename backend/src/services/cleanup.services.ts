import fs from "node:fs/promises";
import { logger } from "../core/logger/logger.js";


export async function cleanupRepositoryFiles(
  zipPath: string,
  extractedPath: string,
): Promise<void> {
  try {

    console.log("🧹 CLEANUP START", {
      zipPath,
      extractedPath,
      time: new Date().toISOString(),
    });
    await fs.unlink(zipPath);

    await fs.rm(extractedPath, {
      recursive: true,
      force: true,
    });

    logger.info("Temporary repository files cleaned successfully.");
  } catch (error: any) {
    logger.error("Cleanup failed:", error);
  }
}

