
import mongoose from "mongoose";
import type {
  LlmAnalysisDto,
} from "../dtos/llm-analysis.dto.js";
import { AnalysisReportModel } from "../models/analyis-report.model.js";
import { AnalysisModel } from "../models/analysis.models.js";
import { AnalysisReportDocument } from "../utils/analysis-report-pdf.js";

export async function createAnalysisReport(
  analysisId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  report: LlmAnalysisDto,
) {

  return AnalysisReportModel.findOneAndUpdate(
    { analysisId, userId },
    {
      $set: {
        summary: report.summary,
        scores: report.scores,
        architecture: report.architecture,
        codeQuality: report.codeQuality,
        technologies: report.technologies,
        security: report.security,
        recommendations: report.recommendations,
        risks: report.risks,
      },
    },
    {
      returnDocument: "after",
      upsert: true,
    },
  );
}


export async function getAnalysisReport(
  reportId: mongoose.Types.ObjectId,
) {
  return AnalysisReportModel.findOne(reportId)
}

export async function getAnalysisReports(
  userId: mongoose.Types.ObjectId
) {
  const reports = await AnalysisReportModel.find({
    userId
  }).sort({createdAt: -1}).lean();

  return reports;
}


export async function getAnalysisReportsForExport(
  analysisId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
) {
  return AnalysisReportModel.findOne({
    analysisId,
    userId,
  }).lean<AnalysisReportDocument>().exec();
}