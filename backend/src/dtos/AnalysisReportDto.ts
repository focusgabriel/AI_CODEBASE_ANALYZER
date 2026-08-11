import type { LlmAnalysisDto } from "./llm-analysis.dto.js";

export interface AnalysisReportDto
  extends Omit<LlmAnalysisDto, "scores"> {
  scores: {
    architecture: number;
    codeQuality: number;
    technologies: number;
    security: number;
    overall: number;
  };
}