import mongoose from "mongoose";

export interface UploadRepositoryDto {
  analysisId: mongoose.Types.ObjectId;
  originalFileName: string;
  storedFileName: string;
  filePath: string;
  extractedPath: string;
}

export interface UploadResponseDto {
  uploadId: string;
}
