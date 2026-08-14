import mongoose from "mongoose";
import { MetricDto } from "../dtos/metrics.dto.js";
import { MetricsModel } from "../models/metrics.model.js";
import {
  saveMetrics as persistMetrics,
} from "../repositories/metrics.repository.js";

export async function saveMetrics(
  analysisId: mongoose.Types.ObjectId,
  metrics: MetricDto,
) {
  return await persistMetrics(
    analysisId,
    metrics,
  );
}

export async function getMetricsByAnalysisId(
  analysisId: mongoose.Types.ObjectId,
) {
  return MetricsModel.findOne({
    analysisId,
  }).lean();
}