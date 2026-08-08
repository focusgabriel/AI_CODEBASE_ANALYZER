import fs from "node:fs/promises";

import { getFilesByAnalysisId } from "../repositories/file.repository.js";
import { readFileContent } from "../utils/file-reader.js";
import { SUPPORTED_LANGUAGES } from "../utils/supported-language.js";

export async function prepareAnalysis(
  analysisId: string,
) {
  const files = await getFilesByAnalysisId(analysisId);

  const readableFiles = [];

  for (const file of files) {

    const isPackageJson = file.path.endsWith("package.json");

    if (
      !isPackageJson &&
      !SUPPORTED_LANGUAGES.includes(file.language)
    ) {
      continue;
    }

    try {
      const content = await readFileContent(file.path);

      readableFiles.push({
        id: file._id,
        path: file.path,
        extension: file.extension,
        language: file.language,
        content,
      });

      console.log("✅ FILE READ:", file.path);
    } catch (error) {
      console.error("❌ FAILED TO READ FILE:", {
        path: file.path,
        extension: file.extension,
        language: file.language,
        error,
      });

      continue;
    }
  }

  console.log("========== PREPARE ANALYSIS ==========");
  console.log("DB files:", files.length);
  console.log("Readable files:", readableFiles.length);
  console.log("======================================");

  return readableFiles;
}