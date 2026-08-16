
import api from "../api/fetch";
// import type { DashboardResponse } from "../types/dashboard";


export async function getScoreTrend() {

  const response = await api.get("/dashboard");

  const trend = response.data.scoreTrend.trend

  return trend;
}