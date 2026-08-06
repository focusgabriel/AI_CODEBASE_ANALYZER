import { getFilesByAnalysisId } from "../repositories/file.repository.js";
import { readFileContent } from "../utils/file-reader.js";
import { SUPPORTED_LANGUAGES } from "../utils/supported-language.js";

export async function prepareAnalysis(
  analysisId: string,
) {
  const files = await getFilesByAnalysisId(analysisId);

  const readableFiles = [];

  for (const file of files) {
    if (!SUPPORTED_LANGUAGES.includes(file.language)) {
      continue;
    }

    const content = await readFileContent(file.path);

    readableFiles.push({
      id: file._id,
      path: file.path,
      language: file.language,
      content,
    });
  }

  return readableFiles;
}