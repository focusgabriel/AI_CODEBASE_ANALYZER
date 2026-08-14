import { Request, Response, NextFunction } from "express";
import { createAnalysis, getAllAnalysisForUser, getAnalysisForUser } from "../services/analysis.services.js";
import { AppError } from "../core/errors/AppError.js";

export const createAnalysisController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body;
    const userId = req.user!.id;

    if(name === "") {
      throw new AppError("Name is required", 401);
    }

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
    const {analysisId } = req.params
    const userId = req.user!.id

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
      }

    })
  } catch (error) {
    next(error);
  }
}

export async function getAllAnalysisForUserController(
  req:Request,
  res:Response,
  next:NextFunction
) {
  const user = req.user!.id

  if(!user) {
    throw new AppError("UnAuthorized", 404);
  }

  const getAnalysis = await getAllAnalysisForUser(user)

  return res.status(200).json({
    success: true,
    getAnalysis
  })
}