import { prepareAnalysis } from "./analyzer.services.js";
import { saveMetrics } from "./metrics-persistence.services.js";
import { extractMetrics } from "./metrics.services.js";
import { parseFile } from "./parser.services.js";


export async function analyzeRepository(
  analysisId: string,
) {
  
  const files = await prepareAnalysis(analysisId);

  for (const file of files) {
    try {
      const ast = await parseFile(
        file.language,
        file.content,
      );

      if (!ast) continue;

      const metrics = extractMetrics(ast);

      await saveMetrics(
        analysisId,
        file.id.toString(),
        metrics,
      );  

    } catch (error) {
      console.log(
        `Skipping file: ${file.path}`
      );

      continue;
    }
  }

  return {
    totalFiles: files.length,
  };
}