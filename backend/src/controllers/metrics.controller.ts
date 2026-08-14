import { NextFunction, Request, Response } from "express";
import { AppError } from "../core/errors/AppError.js";
import { gettingMetricsByAnalysis } from "../services/metrics.services.js";
import { getAllMetricsForUser } from "../services/analysis.services.js";

export async function getMetricsByAnalysisController(
  req:Request,
  res:Response,
  next:NextFunction
) {

  const { analysisId } = req.params;

  if(!analysisId) {
    throw new AppError("UserId and AnalysisId are required", 400);
  } 

  const response = await gettingMetricsByAnalysis(analysisId as string);

  return res.status(200).json({
    success: true,
    response
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