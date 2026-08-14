import mongoose from "mongoose";
import { UploadRepositoryDto } from "../dtos/upload.dto.js";
import { UploadModel } from "../models/upload.models.js";

export async function createUploadRecord(data: UploadRepositoryDto) {
  return UploadModel.create(data);
}

export async function getUploadRecord(
  uploadId: mongoose.Types.ObjectId,
  analysisId: mongoose.Types.ObjectId,
) {
  return UploadModel.findOne({
    _id: uploadId,
    analysisId,
  })
}