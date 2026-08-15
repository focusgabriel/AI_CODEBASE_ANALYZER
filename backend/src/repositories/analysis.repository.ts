

import mongoose from "mongoose";
import { CreateAnalysisDto } from "../dtos/analysis.dto.js";
import { AnalysisModel } from "../models/analysis.models.js";
import { AnalysisReportModel } from "../models/analyis-report.model.js";

export async function createAnalysisRecord(data: CreateAnalysisDto) {
  return AnalysisModel.create(data);
}

export async function findAnalysisForUser(
  analysisId: string,
  userId: string,
) {
  return AnalysisModel.findOne({
    _id: analysisId,
    userId,
  })
}

export async function findUserAnalysis(
  userId: string
) {
  return AnalysisModel.find({
    userId
  })
}


export async function findAnalysisById(
  analysisId: mongoose.Types.ObjectId,
  repositoryName: string,
  statusUpdate: string
) {
  return await AnalysisModel.findByIdAndUpdate(
  analysisId,
  {
    $set: {
      name: repositoryName,
      status: statusUpdate,
    },
  },
  {
    new: true,
  },
);
}



// geting the scores for the authenticated user from the analysis if it is finished.
export async function getUserScoreTrend(
  userId: string,
) {
  const objectUserId =
    new mongoose.Types.ObjectId(userId);

  const analyses = await AnalysisModel.find({
    userId: objectUserId,
    status: "COMPLETED",
    reportId: {
      $ne: null,
    },
  })
    .sort({
      createdAt: -1,
    })
    .limit(7)
    .lean();

  const reportIds = analyses
    .map((analysis) => analysis.reportId)
    .filter(Boolean);

  const reports =
    await AnalysisReportModel.find({
      _id: {
        $in: reportIds,
      },
    }).lean();

  const reportMap = new Map(
    reports.map((report) => [
      report._id.toString(),
      report,
    ]),
  );

  return analyses
    .map((analysis) => {
      const report = reportMap.get(
        analysis.reportId!.toString(),
      );

      if (!report) {
        return null;
      }

      return {
        analysisId: analysis._id.toString(),
        score: report.scores?.overall,
        date: analysis.createdAt,
      };
    })
    .filter(Boolean)
    .reverse();
}