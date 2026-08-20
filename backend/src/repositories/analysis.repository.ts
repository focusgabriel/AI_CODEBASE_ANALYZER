import mongoose, { SortOrder } from "mongoose";
import { CreateAnalysisDto } from "../dtos/analysis.dto.js";
import { AnalysisModel } from "../models/analysis.models.js";
import { AnalysisReportModel } from "../models/analyis-report.model.js";
import { FileModel } from "../models/file.model.js";
import { MetricsModel } from "../models/metrics.model.js";
import { UploadModel } from "../models/upload.models.js";

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
  }).sort({
    createdAt: -1,
  });
}

export async function findUserAnalysis(
  filter: any,
  sortOption: Record<string, SortOrder>,
  skip: number,
  limitNumber: number,
) {
  return AnalysisModel.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(limitNumber);
}

export async function AnalysisPaginationCount(filter: any) {
  return AnalysisModel.countDocuments(filter);
}

export async function findUserAnalysisMetric(userId: string) {
  return AnalysisModel.find({ userId });
}

export async function findUserIdByAnalysis(userId: string) {
  return AnalysisModel.find({ userId }).sort({ createdAt: -1 });
}

/**
 * Cascade delete an analysis and all its related data.
 *
 * The Analysis collection is the single source of truth. When an analysis
 * is deleted, we must also remove:
 *  - Files (FileModel)
 *  - Metrics (MetricsModel)
 *  - Uploads (UploadModel)
 *  - AnalysisReport (AnalysisReportModel)
 *
 * All operations run inside a MongoDB transaction so that either everything
 * is deleted or nothing is — keeping the database consistent.
 */
export async function deleteAnalysisForUser(
  analysisId: string,
  userId: string,
) {
  const objectAnalysisId = new mongoose.Types.ObjectId(analysisId);
  const objectUserId = new mongoose.Types.ObjectId(userId);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Find the analysis to ensure it belongs to the user
    const analysis = await AnalysisModel.findOne({
      _id: objectAnalysisId,
      userId: objectUserId,
    }).session(session);

    if (!analysis) {
      await session.abortTransaction();
      session.endSession();
      return null;
    }

    // 2. Delete the analysis report (if any)
    await AnalysisReportModel.deleteMany({
      analysisId: objectAnalysisId,
    }).session(session);

    // 3. Delete all files for this analysis
    await FileModel.deleteMany({
      analysisId: objectAnalysisId,
    }).session(session);

    // 4. Delete metrics for this analysis
    await MetricsModel.deleteMany({
      analysisId: objectAnalysisId,
    }).session(session);

    // 5. Delete uploads for this analysis
    await UploadModel.deleteMany({
      analysisId: objectAnalysisId,
    }).session(session);

    // 6. Finally, delete the analysis itself
    await AnalysisModel.deleteOne({
      _id: objectAnalysisId,
      userId: objectUserId,
    }).session(session);

    await session.commitTransaction();
    session.endSession();

    return analysis;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
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
  statusUpdate: string,
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
  ).sort({
    createdAt: -1,
  });
}

// getting the scores for the authenticated user from the analysis if it is finished.
export async function getUserScoreTrend(userId: string) {
  const objectUserId = new mongoose.Types.ObjectId(userId);

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
    .lean();

  const reportIds = analyses
    .map(analysis => analysis.reportId)
    .filter(Boolean);

  const reports = await AnalysisReportModel.find({
    _id: {
      $in: reportIds,
    },
  }).lean();

  const reportMap = new Map(
    reports.map(report => [
      report._id.toString(),
      report,
    ]),
  );

  return analyses
    .map(analysis => {
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