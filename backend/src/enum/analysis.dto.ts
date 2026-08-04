import mongoose from "mongoose";

export enum AnalysisStatus {
  PENDING = "PENDING",
  UPLOADING = "UPLOADING",
  EXTRACTING = "EXTRACTING",
  ANALYZING = "ANALYZING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum SourceType {
  ZIP = "ZIP",
  GITHUB = "GITHUB",
}
