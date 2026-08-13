import { MetricsModel } from "../models/metrics.model.js";
import { MetricDto } from "../dtos/metrics.dto.js";

export async function saveMetrics(
  analysisId: string,
  metrics: MetricDto,
) {
  return MetricsModel.findOneAndUpdate(
    { analysisId },
    {
      $set: {
        analysisId,
        imports: metrics.imports,
        exports: metrics.exports,
        functions: metrics.functions,
        classes: metrics.classes,
        interfaces: metrics.interfaces,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );
}

export async function getMetricsByAnalysisId(
  analysisId: string,
) {
  return MetricsModel.findOne({
    analysisId,
  }).lean();
}