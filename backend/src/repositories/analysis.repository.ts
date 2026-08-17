

import mongoose, { SortOrder } from "mongoose";
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
  .sort({
    createdAt: -1,
  })
}

export async function findUserAnalysis(
  // userId: string,
  filter: any,
  sortOption: Record<string, SortOrder>,
  skip: number,
  limitNumber: number
) {
  return AnalysisModel
    .find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(limitNumber)
}

export async function AnalysisPaginationCount(
  filter: any
) {
  return AnalysisModel.countDocuments(filter)
}

export async function findUserAnalysisMetric(
  userId: string
) {
  return AnalysisModel.find({userId})
}

export async function findUserIdByAnalysis(
  userId: string
) {
  return AnalysisModel.find({userId}).sort({createdAt: -1})
}


export async function deleteAnalysisForUser(
  analysisId: string,
  userId: string,
) {
  return AnalysisModel.findOneAndDelete({
    _id: analysisId,
    userId,
  });
}

export async function updateAnalysisNameForUser(
  analysisId: string,
  userId: string,
  name: string,
) {
  return AnalysisModel.findOneAndUpdate(
    {
      _id: analysisId,
      userId,
    },
    {
      $set: {
        name,
      },
    },
    {
      returnDocument: "after",
    },
  );
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
    returnDocument: "after",
  },
)
.sort({
  createdAt: -1,
});
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