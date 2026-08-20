import mongoose from "mongoose";
import type {
  Request,
  Response,
} from "express";
import { getReportByAnalysisId } from "../services/report.services.js";
import { generateAnalysisReportPdf } from "../utils/analysis-report-pdf.js";

export async function exportAnalysisReportController(
  req: Request,
  res: Response,
) {
  try {
    const { analysisId } =
      req.params;

    if (
      !analysisId ||
      !mongoose.isValidObjectId(
        analysisId,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid analysis ID",
      });
    }

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const report =
      await getReportByAnalysisId(
        new mongoose.Types.ObjectId(
          analysisId as string,
        ),
        new mongoose.Types.ObjectId(
          req.user.id,
        ),
      );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Analysis report not found",
      });
    }

    generateAnalysisReportPdf(
      report,
      res,
    );
  } catch (error) {
    console.error(
      "Failed to export analysis report:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to export analysis report",
    });
  }
}