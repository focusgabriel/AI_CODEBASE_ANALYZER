import { MetricsModel } from "../models/metrics.model.js";
import type { aggregateMetrics } from "../services/metrics-aggregation.services.js";

export async function saveAggregateMetrics(
  analysisId: string,
  metrics: typeof aggregateMetrics,
) {
  return MetricsModel.findOneAndUpdate(
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
      setDefaultsOnInsert: true,
    },
  );
}

export async function getMetricsByAnalysisId(
  analysisId: string,
) {
  return MetricsModel.findOne({ analysisId }).lean();
}

// export async function getMetricsByAnalysis(analysisId:string, userId:string) {
//   return MetricsModel.find({
//     analysisId
//   })
// }