import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import path from "node:path";

import { AppError } from "../core/errors/AppError.js";
import { extractZip } from "../utils/unzip.js";
import { createUpload } from "../services/upload.services.js";
import { scanDirectory } from "../utils/file-scanner.js";
import { replaceAnalysisFiles } from "../services/file.services.js";
import { detectLanguage } from "../utils/language-detector.js";
import { analyzeRepository } from "../services/analysis-engine.services.js";
import { cleanupRepositoryFiles } from "../services/cleanup.services.js";
import { updateStatus } from "../services/analysis.services.js";
import { logger } from "../core/logger/logger.js";
import { AnalysisStatus } from "../enum/analysis.dto.js";

export async function uploadRepositoryController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.file) {
    return next(
      new AppError("Repository zip is required", 400),
    );
  }

  const { analysisId } = req.params;
  const userId = req.user!.id;

  if (!mongoose.Types.ObjectId.isValid(analysisId as string)) {
    return next(
      new AppError("Invalid analysis ID", 400),
    );
  }

  if (!mongoose.Types.ObjectId.isValid(userId as string)) {
    return next(
      new AppError("Invalid analysis ID", 400),
    );
  }

  const objectId = new mongoose.Types.ObjectId(
    analysisId as string
  );
  const UserId = new mongoose.Types.ObjectId(
    userId as string
  );

  const file = req.file;

  const extractedPath = path.join(
    "storage",
    "extracted",
    path.parse(file.filename).name,
  );

  try {
    await updateStatus(
      objectId,
      AnalysisStatus.PROCESSING,
    );

    /*
     * 1. Extract repository
     */
    console.time("extract");

    await extractZip(
      file.path,
      extractedPath,
    );

    console.timeEnd("extract");

    /*
     * 2. Scan extracted repository
     */
    console.time("scan");

    const files =
      await scanDirectory(extractedPath);

    console.timeEnd("scan");

    console.log(
      "📁 Total files:",
      files.length,
    );

    /*
     * 3. Persist upload information
     */
    await createUpload({
      analysisId: objectId,
      originalFileName: file.originalname,
      storedFileName: file.filename,
      filePath: file.path,
      extractedPath,
    });

    /*
     * 4. Persist discovered repository files
     */
    console.time("save-files");

    await replaceAnalysisFiles(
      objectId.toString(),
      files.map((file) => ({
        analysisId: objectId,
        path: file.path,
        extension: file.extension,
        language: detectLanguage(
          file.extension,
        ),
        size: file.size,
        status: "PENDING",
      })),
    );

    console.timeEnd("save-files");

    /*
     * 5. Run complete analysis pipeline
     */
    console.time("analysis");

    console.log(
      "🔥 ANALYSIS STARTED",
      objectId.toString(),
    );

    const analysisResult =
      await analyzeRepository(
        objectId,
        UserId
      );

    console.timeEnd("analysis");

    console.log(
      "🔥 ANALYSIS FINISHED",
    );

    /*
     * 6. Cleanup temporary repository files
     */
    await cleanupRepositoryFiles(
      file.path,
      extractedPath,
    );

    /*
     * 7. Return analysis result
     */
    return res.status(201).json({
      message:
        "Repository analyzed successfully",
      analysis: analysisResult,
    });
  } catch (error:any) {
    logger.error(
      "Repository analysis failed:",
      error,
    );

    try {
      await updateStatus(
        objectId,
        AnalysisStatus.FAILED,
      );
    } catch (statusError: any) {
      logger.error(
        "Failed to update analysis status:",
        statusError,
      );
    }

    /*
     * Cleanup even when analysis fails.
     */
    try {
      await cleanupRepositoryFiles(
        file.path,
        extractedPath,
      );
    } catch (cleanupError: any) {
      logger.error(
        "Cleanup failed:",
        cleanupError,
      );
    }

    next(error);
  }
}