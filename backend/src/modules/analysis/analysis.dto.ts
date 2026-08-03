import mongoose from "mongoose";
import { AnalysisStatus, SourceType } from "./analysis.types.js";

export interface CreateAnalysisRequestDto {
  userId: mongoose.Types.ObjectId;
  name: string;
}

export interface CreateAnalysisDto {
  userId: mongoose.Types.ObjectId;

  name: string;

  status: AnalysisStatus;

  sourceType: SourceType;

  sourceLocation: string;
}