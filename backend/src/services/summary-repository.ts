import { getMetricsByAnalysisId } from "../repositories/metrics.repository.js";


export async function buildRepositorySummary(analysisId: string){
  const metrics = await getMetricsByAnalysisId(analysisId);

  const summary = {
    totalFiles: metrics.length,

    imports: 0,
    exports: 0,
    functions: 0,
    interfaces: 0,
    classes: 0,
  };

  for(const metric of metrics) {
    summary.imports += metric.imports as number;
    summary.exports += metric.exports as number ;
    summary.functions += metric.functions as number;
    summary.interfaces += metric.interfaces as number;
    summary.classes += metric.classes as number;
  }

  return summary;
}