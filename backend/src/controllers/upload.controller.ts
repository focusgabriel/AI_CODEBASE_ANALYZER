import { NextFunction, Request, Response } from "express";
import { AppError } from "../core/errors/AppError.js";
import path from "node:path";

import { extractZip } from "../utils/unzip.js";
import { createUpload } from "../services/upload.services.js";
import mongoose from "mongoose";
import { scanDirectory } from "../utils/file-scanner.js";
import fs from "node:fs";
import { replaceAnalysisFiles } from "../services/file.services.js";
import { detectLanguage } from "../utils/language-detector.js";
import { analyzeRepository } from "../services/analysis-engine.services.js";
import { buildRepositorySummary } from "../services/summary-repository.js";
import { generateReport } from "../services/llm.services.js";
import { saveReport } from "../services/report.services.js";
import { cleanupRepositoryFiles } from "../services/cleanup.services.js";
import { updateStatus } from "../services/analysis.services.js";
import { logger } from "../core/logger/logger.js";

export async function uploadRepositoryController(
  req: Request,
  res: Response,
  next: NextFunction,
) {

  console.log(
    "🔥🔥🔥 CURRENT uploadRepositoryController EXECUTED 🔥🔥🔥"
  );

  if (!req.file) {
    return next(new AppError("Repository zip is required", 400));
  }

  const { analysisId } = req.params;

  const objectId = new mongoose.Types.ObjectId(analysisId as string);

  try {
    await updateStatus(objectId, "PROCESSING")

    const file = req.file;

    const extractedPath = path.join(
      "storage",
      "extracted",
      path.parse(file.filename).name,
    );

    console.log("🚨🚨 UPLOAD REQUEST START", {
      analysisId: objectId.toString(),
      extractedPath,
      time: new Date().toISOString(),
    });
    // console.log(extractedPath);

    console.time("extract");
    await extractZip(file.path, extractedPath);

    const test_path = path.join(
      extractedPath,
      "checkpoint10-main",
      "src",
      "App.js",
    );

    console.log("🧪 AFTER EXTRACTION:", {
      path: test_path,
      test_path,
      exists: fs.existsSync(test_path),
    });


    console.timeEnd("extract");

    console.log("Uploaded file:", file.path);
    console.log("File exists:", fs.existsSync(file.path));


    console.log(fs.existsSync(extractedPath));

    console.time("scan");
    const files = await scanDirectory(extractedPath);


    console.log(
      files.map((file) => file.path)
    );

    console.log(fs.existsSync(
      "storage\\extracted\\f593325e-ecfc-43fd-aaf3-e36fea64f244\\checkpoint10-main\\src\\App.js"
    ));

    const testPath = path.join(
      extractedPath,
      "checkpoint10-main",
      "src",
      "App.js",
    );

    console.log("🧪 TEST APP.JS:", {
      path: testPath,
      exists: fs.existsSync(testPath),
    });


    console.log("🧪 AFTER SCAN:", {
      path: testPath,
      exists: fs.existsSync(testPath),
    });

    console.log(
      "🧪 SCANNED APP.JS:",
      files.find((file) => file.path.endsWith("src\\App.js"))
    );

    console.timeEnd("scan");

    console.log(extractedPath)

    console.log("Total Files:", files.length);

    console.time("upload");
    const upload = await createUpload({
      analysisId: objectId,
      originalFileName: file.originalname,
      storedFileName: file.filename,
      filePath: file.path,
      extractedPath,
    });
    console.timeEnd("upload");

    console.time("save-files");
    await replaceAnalysisFiles(
      objectId.toString(),
      files.map((file) => ({
        analysisId: objectId,
        path: file.path,
        extension: file.extension,
        language: detectLanguage(file.extension),
        size: file.size,
        status: "PENDING",
      })),
    );
    console.timeEnd("save-files");


    console.time("analysis");
    console.log(
      "🔥 ANALYSIS STARTED"
    );

    const checkBeforeAnalysis = path.join(
      extractedPath,
      "checkpoint10-main",
      "src",
      "App.js",
    );

    console.log("======================================")

    console.log("🔥 BEFORE ANALYSIS FILE CHECK:", {
      path: checkBeforeAnalysis,
      exists: fs.existsSync(checkBeforeAnalysis),
    });

    console.log("🚨🚨 ANALYSIS REQUEST START", {
      analysisId,
      time: new Date().toISOString(),
    });
    const analysisResult = await analyzeRepository(objectId.toString());

    console.timeEnd("analysis");

    console.log(
      "🔥 ANALYSIS FINISHED"
    );

    // console.time("summary");
    // const summary = await buildRepositorySummary(
    //   objectId.toString(),
    // );
    // console.timeEnd("summary");

    // console.time("llm");
    // const report = await generateReport(summary);
    // console.timeEnd("llm");


    // console.time("save-report");
    // const savedReport = await saveReport(
    //   objectId.toString(),
    //   report,
    // );
    // console.timeEnd("save-report");

    // console.log(report);
    // console.log("reportId: ", savedReport._id);

    // await updateStatus(objectId, "COMPLETED", savedReport._id.toString());
    await updateStatus(objectId, "COMPLETED");


    await cleanupRepositoryFiles(
      file.path,
      extractedPath,
    );
    return res.status(201).json({
      message: "Repository uploaded successfully",
      analysis: analysisResult
    });
  } catch (error: any) {
    logger.error("Cleanup failed:", error);
    await updateStatus(objectId, "FAILED");
    next(error)
  }

}




