import { ReportModel } from "../models/report.model.js";


export async function createReport(
  analysisId: string,
  content: string,
) {
  return ReportModel.create({
    analysisId,
    content,
  });
}

export async function getReportByAnalysisId(
  analysisId: string,
) {
  return ReportModel.findOne({
    analysisId,
  })
}