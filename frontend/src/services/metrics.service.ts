import api from "../api/fetch";
import type { MetricsResponse, ScoreTrendResponse } from "../types/metrics";



export async function getMetrics(
  analysisId: string,
): Promise<MetricsResponse> {
  const response = await api.get(
    `/metrics/${analysisId}`,
  );

  return response.data;
}

export async function getScoreTrend(): Promise<ScoreTrendResponse> {
  const response = await api.get(
    "/analyses/score-trend",
  );

  return response.data;

}