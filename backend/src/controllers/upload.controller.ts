import { NextFunction, Request, Response } from "express";
import { AppError } from "../core/errors/AppError.js";
import path from "node:path";

import { extractZip } from "../utils/unzip.js";
import { createUpload } from "../services/upload.services.js";
import mongoose from "mongoose";
import { scanDirectory } from "../utils/file-scanner.js";
import { logger } from "../core/logger/logger.js";
import fs from "node:fs";
import { saveFiles } from "../services/file.services.js";
import { detectLanguage } from "../utils/language-detector.js";
import { readFileContent } from "../utils/file-reader.js";

export async function uploadRepositoryController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.file) {
    return next(new AppError("Repository zip is required", 400));
  }

  const { analysisId } = req.params;
  const objectId = new mongoose.Types.ObjectId(analysisId as string);

  const file = req.file;

  const extractedPath = path.join(
    "storage",
    "extracted",
    path.parse(file.filename).name,
  );

  await extractZip(file.path, extractedPath);

  console.log(fs.existsSync(extractedPath));
  console.log(extractedPath);

  const files = await scanDirectory(extractedPath);

  // console.log(extractedPath)
  // console.log(files)

  logger.info(files);

  const upload = await createUpload({
    analysisId: objectId,
    originalFileName: file.originalname,
    storedFileName: file.filename,
    filePath: file.path,
    extractedPath,
  });

  await saveFiles(
    files.map((file) => ({
      analysisId: objectId,
      path: file.path,
      extension: file.extension,
      language: detectLanguage(file.extension),
      size: file.size,
      status: "PENDING",
    })),
  );

  const content = await readFileContent(files[0]!.path);
  console.log("file read:", content.substring(0, 500));

  return res.status(201).json({
    success: true,
    data: upload,
  });
}
