import mongoose from "mongoose";
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

export async function findReportById(
  reportId: mongoose.Types.ObjectId,
) {
  return ReportModel.findById(reportId);
}