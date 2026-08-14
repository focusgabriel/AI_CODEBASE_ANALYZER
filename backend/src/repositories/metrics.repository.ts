import { MetricsModel } from "../models/metrics.model.js";
import { MetricDto } from "../dtos/metrics.dto.js";
import mongoose, { mongo } from "mongoose";

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

// export async function getMetricsByAnalysisId(
//   analysisId: mongoose.Types.ObjectId,
// ) {
//   return await MetricsModel.findOne({
//     analysisId,
//   });
// }

export async function getMetricsByUser(
  analysisId:  mongoose.Types.ObjectId,
) {
  return await MetricsModel.findOne({
    analysisId,
  });
}



export async function getMetricsByAnalysisId(
  analysisId: mongoose.Types.ObjectId,
) {
  return await MetricsModel.findOne({
    analysisId
  });
}

export async function getMetricsByUserId(
  userId: string,
) {
  return await MetricsModel.aggregate([
    {
      $lookup: {
        from: "analyses",
        localField: "analysisId",
        foreignField: "_id",
        as: "analysis",
      },
    },

    {
      $unwind: "$analysis",
    },

    {
      $match: {
        "analysis.userId":
          new mongoose.Types.ObjectId(userId),
      },
    },

    {
      $project: {
        _id: 1,
        analysisId: 1,

        imports: 1,
        exports: 1,
        functions: 1,
        classes: 1,
        interfaces: 1,

        totalLines: 1,
        codeLines: 1,
        commentLines: 1,
        blankLines: 1,

        filesAnalyzed: 1,

        createdAt: 1,
        updatedAt: 1,
      },
    },

    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);
}