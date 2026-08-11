import type { LlmAnalysisDto } from "../dtos/llm-analysis.dto.js";

export interface LlmProvider {
  analyze(prompt: string): Promise<LlmAnalysisDto>;
}