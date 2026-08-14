import mongoose from "mongoose";
import { CreateFileDto } from "../dtos/file.dto.js";
import {
  createFiles,
  deleteFilesByAnalysisId,
  getFilesByAnalysisId,
  getFilesByUserId,
} from "../repositories/file.repository.js";

// export async function replaceAnalysisFiles(
//   analysisId: string,
//   files: CreateFileDto[],
// ) {
//   await deleteFilesByAnalysisId(analysisId);

//   return createFiles(files);
// }



export async function replaceAnalysisFiles(
  analysisId: mongoose.Types.ObjectId,
  files: CreateFileDto[],
) {
  const deleted = await deleteFilesByAnalysisId(
    analysisId,
  );

  console.log("🗑️ OLD FILE RECORDS DELETED:", deleted.deletedCount);

  const created = await createFiles(files);

  console.log("📁 NEW FILE RECORDS CREATED:", created.length);

  return created;
}


export async function gettingFilesByUser(
  userId: mongoose.Types.ObjectId,
) {
  return await getFilesByUserId(
    userId,
  );
}


export async function gettingFilesByAnalysisId(
  analysisId: mongoose.Types.ObjectId,
) {
  return await getFilesByAnalysisId(
    analysisId,
  );
}