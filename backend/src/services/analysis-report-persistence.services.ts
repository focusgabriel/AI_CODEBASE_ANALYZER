import mongoose from "mongoose";
import { AnalysisReportDto } from "../dtos/AnalysisReportDto.js";
import type { LlmAnalysisDto } from "../dtos/llm-analysis.dto.js";

import {
  createAnalysisReport,
  getAnalysisReports,
} from "../repositories/analysis-report.repository.js";

export async function saveAnalysisReport(
  analysisId: string,
  userId: string,
  report: LlmAnalysisDto,
) {
  const {
    architecture,
    codeQuality,
    technologies,
    security,
  } = report.scores;

  const overall = Number(
    (
      architecture * 0.25 +
      codeQuality * 0.30 +
      technologies * 0.20 +
      security * 0.25
    ).toFixed(1),
  );

  const analysisReport: AnalysisReportDto = {
    ...report,
    scores: {
      architecture,
      codeQuality,
      technologies,
      security,
      overall,
    },
  };

  return createAnalysisReport(
    analysisId,
    userId,
    analysisReport,
  );
}

export async function getAllAnalysisReport(
  userId: string
) {
  return await getAnalysisReports(userId);
}