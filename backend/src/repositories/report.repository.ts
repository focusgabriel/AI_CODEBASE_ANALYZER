import mongoose from "mongoose";
import { ReportModel } from "../models/report.model.js";


export async function createReport(
  analysisId: string,
  content: string,
) {
  return ReportModel.findOneAndUpdate(
    { analysisId },
    {
      $set: {
        content,
      },
    },
    {
      returnDocument: "after",
      upsert: true,
    },
  );
}

export async function findReportById(
  reportId: mongoose.Types.ObjectId,
) {
  return ReportModel.findById(reportId);
}