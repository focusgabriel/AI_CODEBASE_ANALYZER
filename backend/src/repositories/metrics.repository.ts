import { MetricsModel } from "../models/metrics.model.js";
import { MetricDto } from "../dtos/metrics.dto.js";

export async function saveMetrics(
  analysisId: string,
  metrics: MetricDto,
) {
  return await MetricsModel.findOneAndUpdate(
    { analysisId },
    {
      $set: {
        analysisId,
        ...metrics,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    },
  );
}

export async function getMetricsByAnalysisId(
  analysisId: string,
) {
  return await MetricsModel.findOne({
    analysisId,
  });
}