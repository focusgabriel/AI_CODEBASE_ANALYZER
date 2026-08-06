import { createReport, getReportByAnalysisId } from "../repositories/report.repository.js";

export async function saveReport(
    analysisId: string,
    content: string,
) {
    return createReport(
      analysisId,
      content,
    );
}

export async function fetchReport(
    analysisId: string,
) {
    return getReportByAnalysisId(
        analysisId,
    );
}