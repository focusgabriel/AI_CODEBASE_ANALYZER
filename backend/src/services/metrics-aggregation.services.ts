import { getMetricsByAnalysisId } from "../repositories/metrics.repository.js";

export async function aggregateMetrics(analysisId: string) {
  const metrics = await getMetricsByAnalysisId(analysisId);

  return metrics.reduce(
    (total, metric) => {
      total.imports += metric.imports ?? 0;
      total.exports += metric.exports ?? 0;
      total.functions += metric.functions ?? 0;
      total.classes += metric.classes ?? 0;
      total.interfaces += metric.interfaces ?? 0;
      return total;
    },
    {
      imports: 0,
      exports: 0,
      functions: 0,
      classes: 0,
      interfaces: 0,
    },
  );
}