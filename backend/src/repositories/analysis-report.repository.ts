
import type {
  LlmAnalysisDto,
} from "../dtos/llm-analysis.dto.js";
import { AnalysisReportModel } from "../models/analyis-report.model.js";

export async function createAnalysisReport(
  analysisId: string,
  report: LlmAnalysisDto,
) {

  return AnalysisReportModel.findOneAndUpdate(
    { analysisId },
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
  analysisId: string,
) {
  return AnalysisReportModel.findOne({
    analysisId,
  }).lean();
}