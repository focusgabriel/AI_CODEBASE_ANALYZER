import { randomUUID } from "node:crypto";
import {
  CreateAnalysisDto,
  CreateAnalysisRequestDto,
  CreateAnalysisResponseDto,
} from "../dtos/analysis.dto.js";
import { AnalysisSourceType, AnalysisStatus } from "../enum/analysis.dto.js";
import { createAnalysisRecord, findAnalysisById, findAnalysisForUser, findUserAnalysis, getUserScoreTrend } from "../repositories/analysis.repository.js";
import { getFilesByAnalysisId } from "../repositories/file.repository.js";
import { updateAnalysisStatus } from "../repositories/newstatus.repository.js";
import mongoose from "mongoose";
import { AppError } from "../core/errors/AppError.js";
import { getMetricsByUser } from "../repositories/metrics.repository.js";
const analysisId = randomUUID();

export async function createAnalysis(
  request: CreateAnalysisRequestDto,
): Promise<CreateAnalysisResponseDto> {
  const dto: CreateAnalysisDto = {
    userId: request.userId,
    // name: request.name,
    status: AnalysisStatus.PENDING,
    sourceType: AnalysisSourceType.ZIP,
    sourceLocation: `/storage${analysisId}/source`,
  };

  const analysis = await createAnalysisRecord(dto);

  return {
    analysisId: analysis._id.toString(),
    sourceType: analysis.sourceType as AnalysisSourceType.ZIP,
    status: analysis.status as AnalysisStatus.PENDING,
  };
}

export async function updateStatus(
  analysisId: mongoose.Types.ObjectId, statusUpdate: AnalysisStatus, reportId?: string
) {
  const newResult = await updateAnalysisStatus(analysisId, statusUpdate, reportId);

  return newResult
}

export async function getAnalysisForUser(
  analysisId: string,
  userId: string,
) {
  const userAnalysis = await findAnalysisForUser(analysisId, userId);

  return userAnalysis
}

export async function getAllAnalysisForUser(
  userId:string
) {
  return await findUserAnalysis(userId);
}

export async function getAllMetricsForUser(
  userId:string
) {
  const Metrics = await findUserAnalysis(userId);

  if(!Metrics) {
    throw new AppError("No Metrics Found", 404);
  }

  let metric;
  for(metric of Metrics){

    return metric._id;

  }

  const getMetrics = await getMetricsByUser(metric!);

  return getMetrics;
}



export async function getAnalysisId(
  analysisId: mongoose.Types.ObjectId,
  repositoryName: string,
  statusUpdate: string
) {

  return findAnalysisById(
    analysisId,
    repositoryName,
    statusUpdate
  )
}



export async function getScoreTrend(
  userId: string,
) {

  if(!userId){
    throw new AppError("Unauthorized User", 401);
  }
  
  const trend =
    await getUserScoreTrend(userId);

  const scores = trend
    .map((item) => item?.score)
    .filter((score): score is number => score !== undefined);

  const highestScore =
    scores.length > 0
      ? Math.max(...scores)
      : 0;

  const lowestScore =
    scores.length > 0
      ? Math.min(...scores)
      : 0;

  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce(
            (total, score) => total + score,
            0,
          ) / scores.length,
        )
      : 0;

  return {
    trend,
    highestScore,
    lowestScore,
    averageScore,
  };
}