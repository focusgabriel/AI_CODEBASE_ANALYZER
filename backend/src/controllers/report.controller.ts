import { NextFunction, Request, Response } from "express";
import { AppError } from "../core/errors/AppError.js";
import { getReportForUser } from "../services/report.services.js";

export async function getReportController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { analysisId, userId } = req.params;

  if (!userId || !analysisId) {
    return next(
      new AppError("Missing analysisId or userId", 400),
    );
  }

  try {
    const report = await getReportForUser(
      analysisId as string,
      userId as string,
    );

    if (!report) {
      return next(
        new AppError("Report not found", 404),
      );
    }

    return res.status(200).json({
      success: true,
      data: report.content,
    });
  } catch (error) {
    next(error);
  }
}