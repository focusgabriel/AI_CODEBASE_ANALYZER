import { CreateFileDto } from "../dtos/file.dto.js";
import {
  createFiles,
  deleteFilesByAnalysisId,
} from "../repositories/file.repository.js";

// export async function replaceAnalysisFiles(
//   analysisId: string,
//   files: CreateFileDto[],
// ) {
//   await deleteFilesByAnalysisId(analysisId);

//   return createFiles(files);
// }



export async function replaceAnalysisFiles(
  analysisId: string,
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