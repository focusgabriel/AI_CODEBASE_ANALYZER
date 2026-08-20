import mongoose from "mongoose";
import { getReportByAnalysisId } from "./report.services.js";


export async function exportAnalysisReport(
  analysisId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
) {
  const report =
    await getReportByAnalysisId(
      analysisId,
      userId,
    );

  if (!report) {
    return null;
  }

  return report;
}