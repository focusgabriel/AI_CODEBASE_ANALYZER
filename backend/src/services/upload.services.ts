import mongoose from "mongoose";

import { UploadResponseDto } from "../dtos/upload.dto.js";
import { createUploadRecord, getUploadByUserId, getUploadRecord } from "../repositories/upload.repository.js";
import { AppError } from "../core/errors/AppError.js";

interface UploadRequest {
  analysisId: mongoose.Types.ObjectId;
  originalFileName: string;
  storedFileName: string;
  filePath: string;
  extractedPath: string;
}

export async function createUpload(
  request: UploadRequest,
): Promise<UploadResponseDto> {
  const upload = await createUploadRecord(request);

  return {
    uploadId: upload._id.toString(),
  };
}



export async function getUploadRecordByAnalysisId(
  uploadId: mongoose.Types.ObjectId,
  analysisId: mongoose.Types.ObjectId,
) {

  if(!analysisId || !uploadId) {
    throw new AppError("UploadId and analysisId are required", 401);
  }

  return getUploadRecord(uploadId, analysisId)
}






export async function getAllUploads(
  userId: mongoose.Types.ObjectId,
) {
  return await getUploadByUserId(
    userId,
  );
}