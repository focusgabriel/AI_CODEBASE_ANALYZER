import { prepareAnalysis } from "./analyzer.services.js";
import { saveMetrics } from "./metrics-persistence.services.js";
import { extractMetrics } from "./metrics.services.js";
import { parseFile } from "./parser.services.js";

export async function analyzeRepository(
  analysisId: string,
) {
  console.log("🚨🚨 ANALYSIS REQUEST START", {
    analysisId,
    time: new Date().toISOString(),
  });

  const files = await prepareAnalysis(analysisId);

  for (const file of files) {
    try {
      console.log("🧠 PARSING FILE:", file.path);

      const ast = parseFile(
        file.extension,
        file.content,
      );

      if (!ast) {
        console.log("⚠️ NO AST:", file.path);
        continue;
      }

      console.log("✅ AST CREATED:", file.path);

      const metrics = extractMetrics(ast);

      console.log("📊 METRICS:", {
        path: file.path,
        metrics,
      });

      await saveMetrics(
        analysisId,
        file.id.toString(),
        metrics,
      );

      console.log("💾 METRICS SAVED:", file.path);

    } catch (error) {
      console.error("❌ FAILED TO ANALYZE FILE:", {
        path: file.path,
        extension: file.extension,
        language: file.language,
        error,
      });

      continue;
    }
  }

  console.log("🔥🔥 ANALYSIS ENGINE FINISHED");

  return {
    totalFiles: files.length,
  };
}