import mongoose from "mongoose";

import { UploadResponseDto } from "../dtos/upload.dto.js";
import { createUploadRecord } from "../repositories/upload.repository.js";

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
