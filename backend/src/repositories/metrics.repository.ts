import { MetricsModel } from "../models/metrics.model.js";
import { MetricDto } from "../dtos/metrics.dto.js";
import mongoose from "mongoose";

export async function saveMetrics(
  analysisId: mongoose.Types.ObjectId,
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
  analysisId: mongoose.Types.ObjectId,
) {
  return await MetricsModel.findOne({
    analysisId,
  });
}

export async function getMetricsByUser(
  analysisId: string,
) {
  return await MetricsModel.findOne({
    analysisId,
  });
}


