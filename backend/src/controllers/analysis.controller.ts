// import { NextFunction, Request, Response } from "express";
// import { analysisService } from "../services/analysis.services.js";

// export class AnalysisController {
//   async createAnalysis(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { userId, name } = req.body as { userId: string; name: string };

//       const analysis = await analysisService.createAnalysis({
//         userId,
//         name,
//       });

//       return res.status(201).json({
//         success: true,
//         data: analysis,
//       });
//     } catch (error) {
//       next(error);
//     }
//   }
// }

import { Request, Response, NextFunction } from "express";
import { createAnalysis, getAnalysisForUser } from "../services/analysis.services.js";
import { AppError } from "../core/errors/AppError.js";

export const createAnalysisController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, name } = req.body;

    const analysis = await createAnalysis({
      userId,
      name,
    });

    return res.status(201).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};


export const getUserAnalysisController = async (
  req:Request,
  res:Response,
  next:NextFunction
) => {
  try {
    const {analysisId, userId} = req.params

    if(!analysisId || !userId) {
      throw new AppError("Analysis ID and user ID are required", 400);
    }

    const analysis = await getAnalysisForUser(analysisId as string, userId as string);

    if (!analysis) {
      return next(
        new AppError("Analysis not found", 404),
      );
    }

    return res.status(200).json({
      success:true,
      data: {
        name: analysis.name,
        status: analysis.status,
        sourceType: analysis.sourceType,
        sourceLocation: analysis.sourceLocation,
        reportId: analysis.reportId,
        startedAt: analysis.startedAt,
        completedAt: analysis.completedAt,
        createdAt: analysis.createdAt,
        updatedAt: analysis.updatedAt,
      }

    })
  } catch (error) {
    next(error);
  }
}