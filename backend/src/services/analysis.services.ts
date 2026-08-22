import { randomUUID } from "node:crypto";
import {
  CreateAnalysisDto,
  CreateAnalysisRequestDto,
  CreateAnalysisResponseDto,
} from "../dtos/analysis.dto.js";
import { AnalysisSourceType, AnalysisStatus } from "../enum/analysis.dto.js";
import { AnalysisPaginationCount, createAnalysisRecord, deleteAnalysisForUser, findAnalysisById, findAnalysisForUser, findUserAnalysis, findUserAnalysisMetric, findUserIdByAnalysis, getUserScoreTrend, updateAnalysisNameForUser } from "../repositories/analysis.repository.js";
import { getFilesByAnalysisId } from "../repositories/file.repository.js";
import { updateAnalysisStatus } from "../repositories/newstatus.repository.js";
import mongoose, { SortOrder } from "mongoose";
import { AppError } from "../core/errors/AppError.js";
import { getMetricsByUser } from "../repositories/metrics.repository.js";
import { emitAnalysisStatusUpdate } from "./status-events.services.js";
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

//  updating the status of the analysis from Pending to Completed as so on. during the lifecycle of the analysis
export async function updateStatus(
  analysisId: mongoose.Types.ObjectId, statusUpdate: AnalysisStatus, reportId?: string
) {
  const newResult = await updateAnalysisStatus(analysisId, statusUpdate, reportId);

  if (newResult) {
    emitAnalysisStatusUpdate(analysisId.toString(), statusUpdate);
  }

  return newResult
}

// to get analysis by the authenticated user and the analysisId meaning a particular analysis.
export async function getAnalysisForUser(
  analysisId: string,
  userId: string,
) {
  const userAnalysis = await findAnalysisForUser(analysisId, userId);

  return userAnalysis
}

export async function getAllAnalysisForUser(
  filter:any,
  sortOption: Record<string, SortOrder>,
  skip: number,
  filterNumber: number,
) {
  return await findUserAnalysis(filter, sortOption, skip, filterNumber);
}

// getting the total pagination count.
export async function getAnalysisCount(
  filter: any
) {
  return await AnalysisPaginationCount(filter)
}

// getting the authenticated user id for the analysis userId field
export async function getUserIdByAnalysis(
  userId: string
) {
  return await findUserIdByAnalysis(userId)
}

export async function deleteAnalysis(
  analysisId: string,
  userId: string,
) {
  const deleted = await deleteAnalysisForUser(analysisId, userId);

  if (!deleted) {
    throw new AppError("Analysis not found", 404);
  }

  return deleted;
}

export async function renameAnalysis(
  analysisId: string,
  userId: string,
  name: string,
) {
  if (!name || !name.trim()) {
    throw new AppError("Analysis name is required", 400);
  }

  const updated = await updateAnalysisNameForUser(
    analysisId,
    userId,
    name.trim(),
  );

  if (!updated) {
    throw new AppError("Analysis not found", 404);
  }

  return updated;
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