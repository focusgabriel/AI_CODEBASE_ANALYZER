import { randomUUID } from "node:crypto";
import {
  CreateAnalysisDto,
  CreateAnalysisRequestDto,
  CreateAnalysisResponseDto,
} from "../dtos/analysis.dto.js";
import { AnalysisStatus, SourceType } from "../enum/analysis.dto.js";
import { createAnalysisRecord, findAnalysisForUser } from "../repositories/analysis.repository.js";
import { getFilesByAnalysisId } from "../repositories/file.repository.js";
import { updateAnalysisStatus } from "../repositories/newstatus.repository.js";
import mongoose from "mongoose";
const analysisId = randomUUID();

export async function createAnalysis(
  request: CreateAnalysisRequestDto,
): Promise<CreateAnalysisResponseDto> {
  const dto: CreateAnalysisDto = {
    userId: request.userId,
    name: request.name,
    status: AnalysisStatus.PENDING,
    sourceType: SourceType.ZIP,
    sourceLocation: `/storage${analysisId}/source`,
  };

  const analysis = await createAnalysisRecord(dto);

  return {
    analysisId: analysis._id.toString(),
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