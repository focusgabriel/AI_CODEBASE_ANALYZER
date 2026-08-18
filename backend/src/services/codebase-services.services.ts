import mongoose from "mongoose";
import { getFilesByAnalysisId } from "../repositories/file.repository.js";
import { AppError } from "../core/errors/AppError.js";

export async function getCodebaseExplorer(
  analysisId: string,
) {

  const objectId = new mongoose.Types.ObjectId(analysisId as string);
  if(!mongoose.Types.ObjectId.isValid(analysisId as string)){
    throw new AppError("invalid input", 400);
  }
  const files =
    await getFilesByAnalysisId(objectId);

  return files.map((file:any) => ({
    fileId: file._id,
    path: file.path,
    name: file.name,
    extension: file.extension,
    language: file.language,
  }));
}