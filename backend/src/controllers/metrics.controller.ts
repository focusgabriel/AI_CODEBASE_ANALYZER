import { NextFunction, Request, Response } from "express";
import { AppError } from "../core/errors/AppError.js";
import { getAllMetricsForUser, gettingMetricsByAnalysis, gettingMetricsByUser } from "../services/metrics.services.js";
import mongoose, { mongo } from "mongoose";

export async function getMetricsByAnalysisController(
  req:Request,
  res:Response,
  next:NextFunction
) {

  const { analysisId } = req.params;

  if(!analysisId) {
    throw new AppError("UserId and AnalysisId are required", 400);
  } 

  const objectId = new mongoose.Types.ObjectId(analysisId as string)

  const metrics = await gettingMetricsByAnalysis(objectId);

  return res.status(200).json({
    success: true,
    metrics
  })
}

export async function getAllMetricsController(
  req:Request,
  res:Response,
  next:NextFunction 
) {
  const user = req.user!.id;

  if(!user){
    throw new AppError("No Metrics Found", 404);
  }

  const metrics = await getAllMetricsForUser(user);

  return res.status(200).json({
    success: true,
    metrics
  })
}



export async function getUserMetricsController(
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

    const metrics =
      await gettingMetricsByUser(user);

    return res.status(200).json({
      success: true,
      metrics,
    });
  } catch (error) {
    next(error);
  }
}