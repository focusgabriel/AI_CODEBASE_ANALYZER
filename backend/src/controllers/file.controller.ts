import { NextFunction, Request, Response } from "express";
import { AppError } from "../core/errors/AppError.js";
import mongoose from "mongoose";
import { gettingFilesByAnalysisId, gettingFilesByUser } from "../services/file.services.js";



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