import { createMetrics } from "../repositories/metrics.repository.js";

export async function saveMetrics(
  analysisId: string,
  fileId: string,
  metrics: any,
) {
  return createMetrics({
    analysisId,
    fileId,
    ...metrics,
  });
}