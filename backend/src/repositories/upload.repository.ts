import { UploadRepositoryDto } from "../dtos/upload.dto.js";
import { UploadModel } from "../models/upload.models.js";

export async function createUploadRecord(data: UploadRepositoryDto) {
  return UploadModel.create(data);
}
