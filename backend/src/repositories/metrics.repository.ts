import { MetricsModel } from "../models/metrics.model.js";

export async function createMetrics(data: any) {
  return MetricsModel.create(data);
}

export async function getMetricsByAnalysisId(analysisId:string) {
  return MetricsModel.find({ analysisId })
}

// export async function getMetricsByAnalysis(analysisId:string, userId:string) {
//   return MetricsModel.find({
//     analysisId
//   })
// }