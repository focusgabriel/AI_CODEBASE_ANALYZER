import { getMetricsByAnalysisId } from "../repositories/metrics.repository.js";

export async function buildRepositorySummary(
  analysisId: string,
) {
  const metrics =
    await getMetricsByAnalysisId(analysisId);

  if (!metrics) {
    return {
      totalFiles: 0,

      imports: 0,
      exports: 0,
      functions: 0,
      interfaces: 0,
      classes: 0,

      totalLines: 0,
      codeLines: 0,
      commentLines: 0,
      blankLines: 0,
    };
  }

  return {
    totalFiles: 0,

    imports: metrics.imports,
    exports: metrics.exports,
    functions: metrics.functions,
    interfaces: metrics.interfaces,
    classes: metrics.classes,

    totalLines: metrics.totalLines,
    codeLines: metrics.codeLines,
    commentLines: metrics.commentLines,
    blankLines: metrics.blankLines,
  };
}