import type { Request, Response } from "express";

import {
  getAnalysisReport,
} from "../repositories/analysis-report.repository.js";

export async function getAnalysisReportController(
  req: Request,
  res: Response,
) {
  try {
    const { analysisId } = req.params;

    if (!analysisId) {
      return res.status(400).json({
        message: "Analysis ID is required",
      });
    }

    const report = await getAnalysisReport(
      analysisId as string,
    );

    if (!report) {
      return res.status(404).json({
        message: "Analysis report not found",
      });
    }

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error(
      "❌ FAILED TO GET ANALYSIS REPORT:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve analysis report",
    });
  }
}