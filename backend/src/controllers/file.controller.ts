import { NextFunction, Request, Response } from "express";
import { AppError } from "../core/errors/AppError.js";
import mongoose from "mongoose"
import { getAnalysisFile, gettingFilesByAnalysisId, gettingFilesByUser } from "../services/file.services.js";
import { extractFileMetrics } from "../services/metrics.services.js";
import { readFileContent } from "../utils/file-reader.js";



export async function getAnalysisFilesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { analysisId } = req.params;

    if (!analysisId) {
      throw new AppError(
        "Unauthorized",
        401,
      );
    }

    const analysisFile = new mongoose.Types.ObjectId(
      analysisId as string
    );

    const files = await gettingFilesByAnalysisId(analysisFile);

    return res.status(200).json({
      success: true,
      // files,
      _id: files.map((file) => file._id),
      LOC: files.reduce((total, file) => total + file.size, 0),
      Language: files.filter((file) => file.language === "UNKNOWN" || file.language === "JSON" ? file === null: file.language).map((file) => file.language),
    });
  } catch (error) {
    next(error);
  }
}


export async function getUserFilesController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError(
        "Unauthorized",
        401,
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId as string)) {
      return next(
        new AppError("Invalid analysis ID", 400),
      );
    }

    const user = new mongoose.Types.ObjectId(
      userId as string
    );

    const files = await gettingFilesByUser(user);

    return res.status(200).json({
      success: true,
      files,
    });
  } catch (error) {
    next(error);
  }
}


export async function getAnalysisFileController(
  req: Request,
  res: Response,
) {
  try {
    const { analysisId, fileId } =
      req.params;

    if (
      !analysisId ||
      !fileId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Analysis ID and file ID are required",
      });
    }

    if (
      !mongoose.isValidObjectId(
        analysisId,
      ) ||
      !mongoose.isValidObjectId(
        fileId,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const file =
      await getAnalysisFile(
        analysisId as string,
        fileId as string,
      );

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: file,
    });
  } catch (error) {
    console.error(
      "Failed to retrieve analysis file:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to retrieve analysis file",
    });
  }
}



export async function getFileMetricsController(
  req: Request,
  res: Response,
) {
  try {
    const {
      analysisId,
      fileId,
    } = req.params;

    if (!analysisId || !fileId) {
      return res.status(400).json({
        success: false,
        message:
          "Analysis ID and file ID are required",
      });
    }

    const file = await getAnalysisFile(
      analysisId as string,
      fileId as string,
    );

    console.log("📁 FILE:", {
      id: file?._id,
      path: file?.path,
      extension: file?.extension,
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    console.log("📖 READING FILE:", file.path);

    const content =
      await readFileContent(file.path);

      console.log("📖 FILE CONTENT:", {
        length: content.length,
        preview: content.slice(0, 100),
      });

    console.log("🧠 EXTRACTING METRICS...");

    const metrics =
      extractFileMetrics(
        file.extension,
        content,
      );
    console.log(metrics?.classes)

    if (!metrics) {
      return res.status(422).json({
        success: false,
        message:
          "Metrics could not be extracted for this file",
      });
    }

    return res.status(200).json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error(
    "❌ FAILED TO CALCULATE FILE METRICS",
    {
      analysisId: req.params.analysisId,
      fileId: req.params.fileId,
      error,
    },
  );

  return res.status(500).json({
    success: false,
    message:
      "Failed to calculate file metrics",
    error:
      error instanceof Error
        ? error.message
        : String(error),
  });
  }
}