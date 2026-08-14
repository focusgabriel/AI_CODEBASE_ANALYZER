import { randomUUID } from "node:crypto";
import {
  CreateAnalysisDto,
  CreateAnalysisRequestDto,
  CreateAnalysisResponseDto,
} from "../dtos/analysis.dto.js";
import { AnalysisSourceType, AnalysisStatus } from "../enum/analysis.dto.js";
import { createAnalysisRecord, findAnalysisForUser, findUserAnalysis } from "../repositories/analysis.repository.js";
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
    name: request.name,
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