import { CreateFileDto } from "../dtos/file.dto.js";
import { FileModel } from "../models/file.model.js";

export async function createFiles(files: CreateFileDto[]) {
  return FileModel.insertMany(files);
}

export async function getFilesByAnalysisId(
  analysisId: string,
) {
  return FileModel.find({ analysisId });
}