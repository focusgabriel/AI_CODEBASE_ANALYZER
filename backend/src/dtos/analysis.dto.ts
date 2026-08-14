import mongoose, { ObjectId } from "mongoose";
import { AnalysisStatus, AnalysisSourceType } from "../enum/analysis.dto.js";

export interface CreateAnalysisRequestDto {
  userId: string;
  // name: string;
}

export interface CreateAnalysisDto {
  userId: string;

  // name: string;

  status: AnalysisStatus;

  sourceType: AnalysisSourceType;

  sourceLocation: string;
}

export interface analysisDto {
  userId: string;

  name: string;

  status: AnalysisStatus;

  sourceType: AnalysisSourceType;

  sourceLocation: string;

  reportId: ObjectId;

  startedAt: Date;

  completedAt: Date;

  createdAt: Date;

  updatedAt: Date;
}

export interface CreateAnalysisResponseDto {
  analysisId: string;
  status: AnalysisStatus;
  sourceType: AnalysisSourceType;
}

// export type NewStatus =
//     | "PENDING"
//     | "PROCESSING"
//     | "COMPLETED"
//     | "FAILED";