import type { LlmAnalysisDto } from "../dtos/llm-analysis.dto.js";

export function validateLlmAnalysis(
  value: unknown,
): LlmAnalysisDto {
  if (!value || typeof value !== "object") {
    throw new Error("LLM returned an invalid response.");
  }

  const result = value as Record<string, unknown>;

  if (typeof result.summary !== "string") {
    throw new Error("LLM response is missing summary.");
  }

  if (!result.architecture || typeof result.architecture !== "object") {
    throw new Error(
      "LLM response is missing architecture.",
    );
  }

  if (!result.codeQuality || typeof result.codeQuality !== "object") {
    throw new Error(
      "LLM response is missing codeQuality.",
    );
  }

  if (!result.technologies || typeof result.technologies !== "object") {
    throw new Error(
      "LLM response is missing technologies.",
    );
  }

  if (!result.security || typeof result.security !== "object") {
    throw new Error(
      "LLM response is missing security.",
    );
  }

  if (!Array.isArray(result.recommendations)) {
    throw new Error(
      "LLM response has invalid recommendations.",
    );
  }

  if (!Array.isArray(result.risks)) {
    throw new Error(
      "LLM response has invalid risks.",
    );
  }

  return value as LlmAnalysisDto;
}