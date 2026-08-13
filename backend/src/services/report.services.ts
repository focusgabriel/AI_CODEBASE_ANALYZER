import mongoose from "mongoose";
import { AppError } from "../core/errors/AppError.js";
import { findAnalysisForUser } from "../repositories/analysis.repository.js";
// import { findReportById } from "../repositories/report.repository.js";

// import { createReport } from "../repositories/report.repository.js";
import { getAnalysisReport } from "../repositories/analysis-report.repository.js";

// export async function saveReport(
//     analysisId: string,
//     content: string,
// ) {
//     return createReport(
//       analysisId,
//       content,
//     );
// }

export async function getReportForUser(
    analysisId: string,
    userId: string,
) {
    const analysis = await findAnalysisForUser(
        analysisId,
        userId,
    );

    if(!analysis) {
        throw new AppError("Unauthorized", 401);
    }

    if(!analysis.reportId) {
        throw new AppError("No report found", 400);
    }

    return getAnalysisReport(analysis.reportId);
}