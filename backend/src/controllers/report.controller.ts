import { NextFunction, Request, Response } from "express";
import { AppError } from "../core/errors/AppError.js";
import { getReportForUser } from "../services/report.services.js";
import { getAllAnalysisReport } from "../services/analysis-report-persistence.services.js";
import mongoose from "mongoose";

export async function getReportController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { analysisId } = req.params;
  const userId = req.user!.id;

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
      data: report,
    });
  } catch (error) {
    next(error);
  }
}


export async function getAllReportsController(
  req:Request,
  res:Response,
  next:NextFunction
) {
  try {
    const user = req.user!.id

    if(!user) {
      throw new AppError("User not Found", 404);
    } 

    // if (!mongoose.Types.ObjectId.isValid(user as string)) {
    //   return next(
    //     new AppError("Invalid analysis ID", 400),
    //   );
    // }
    // const objectId = new mongoose.Types.ObjectId(user as string)

    const reports = await getAllAnalysisReport(user);

    return res.status(200).json({
      success: true,
      reports
    })
  } catch (error) {
    next(error)
  }
}