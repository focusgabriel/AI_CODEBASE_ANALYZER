import mongoose from "mongoose";
import { AnalysisStatus } from "../enum/analysis.dto.js";

export interface CreateFileDto {
  analysisId: mongoose.Types.ObjectId;
  path: string;
  extension: string;
  language: string;
  size: number;
  status: AnalysisStatus;
}

