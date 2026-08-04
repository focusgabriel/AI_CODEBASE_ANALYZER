import mongoose from "mongoose";
import { AnalysisStatus, SourceType } from "../enum/analysis.dto.js";

export interface CreateAnalysisRequestDto {
  userId: string;
  name: string;
}

export interface CreateAnalysisDto {
  userId: string;

  name: string;

  status: AnalysisStatus;

  sourceType: SourceType;

  sourceLocation: string;
}

export interface CreateAnalysisResponseDto {
  analysisId: string;
  status: AnalysisStatus;
}
