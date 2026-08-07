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
import { prepareAnalysis } from "../services/analyzer.services.js";
import { parseFile } from "../services/parser.services.js";
import { extractMetrics } from "../services/metrics.services.js";
import { saveMetrics } from "../services/metrics-persistence.services.js";
import { analyzeRepository } from "../services/analysis-engine.services.js";
import { buildRepositorySummary } from "../services/summary-repository.js";
import { generateReport } from "../services/llm.services.js";
import { saveReport } from "../services/report.services.js";
import { cleanupRepositoryFiles } from "../services/cleanup.services.js";
import { updateStatus } from "../services/analysis.services.js";
import { AnalysisStatus } from "../enum/analysis.dto.js";

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
  try {
  updateStatus(objectId, "PROCESSING")

  const file = req.file;

  const extractedPath = path.join(
    "storage",
    "extracted",
    path.parse(file.filename).name,
  );

  console.log(extractedPath);

  await extractZip(file.path, extractedPath);

  console.log(fs.existsSync(extractedPath));
  console.log(extractedPath);

  const files = await scanDirectory(extractedPath);

  console.log(extractedPath)
  console.log(files)

  console.log("files from:", files);

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

  // console.log("file read:", content.substring(0, 500));

  // const result = await prepareAnalysis(objectId.toString());

  // console.log("=========== resulted files =============")
  // console.log(result.length);
  // console.log(result[0]);

  // console.log("========== Parse Files =========");
  //   const ast = await parseFile(
  //   result[0]!.language,
  //   result[0]!.content,
  // );

  // const metrics = extractMetrics(ast);

  //   await saveMetrics(
  //     objectId.toString(),
  //     result[0]!.id.toString(),
  //     metrics,
  //   );

  // console.log("Metrics Saved");

  // console.log(metrics);

  await analyzeRepository(objectId.toString());

  const summary = await buildRepositorySummary(
    objectId.toString(),
  );

  console.log(summary);

  const report = await generateReport(summary);

  const savedReport = await saveReport(
    objectId.toString(),
    report,
  );

  console.log(report);
  console.log("reportId: ", savedReport._id);

  updateStatus(objectId, "COMPLETED", savedReport._id.toString());

  await cleanupRepositoryFiles(
    file.path,
    extractedPath,
  );

  return res.status(201).json({
    message:"Repository uploaded successfully"
  });
  } catch (error) {
    updateStatus(objectId, "FAILED");
    next(error)
  }

}
