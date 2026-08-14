import mongoose from "mongoose";
import { CreateFileDto } from "../dtos/file.dto.js";
import { FileModel } from "../models/file.model.js";

export async function createFiles(files: CreateFileDto[]) {
  return FileModel.insertMany(files);
}

export async function getFilesByAnalysisId(
  analysisId: mongoose.Types.ObjectId,
) {
  console.log("🔎 GET FILES FOR ANALYSIS:", analysisId);
  const files = await FileModel.find({ analysisId });
  console.log("=========================== Files Length ==============================")
  console.log("🔎 FILE RECORDS FOUND:", files.length);

  return files;
}


export async function deleteFilesByAnalysisId(
  analysisId: string,
) {
  return FileModel.deleteMany({ analysisId });
}




// export async function getFilesByAnalysisId(
//   analysisId: string,
// ) {
//   console.log("🔎 GET FILES FOR ANALYSIS:", analysisId);

//   const files = await FileModel.find({
//     analysisId,
//   });

//   console.log("🔎 FILE RECORDS FOUND:", files.length);

//   return files;
// }