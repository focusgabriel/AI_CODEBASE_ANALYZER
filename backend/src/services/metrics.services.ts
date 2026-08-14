import traverseModule from "@babel/traverse";
import { MetricDto } from "../dtos/metrics.dto.js";
import { getMetricsByAnalysisId } from "./metrics-persistence.services.js";
import { getMetricsByUserId } from "../repositories/metrics.repository.js";
import mongoose from "mongoose";

const traverse =
  (traverseModule as any).default ?? traverseModule;

export function extractMetrics(ast: any): MetricDto {
  const metrics: MetricDto = {
    imports: 0,
    exports: 0,
    functions: 0,
    classes: 0,
    interfaces: 0,

    totalLines: 0,
    codeLines: 0,
    commentLines: 0,
    blankLines: 0,
  };

  traverse(ast, {
    ImportDeclaration() {
      metrics.imports++;
    },

    ExportNamedDeclaration() {
      metrics.exports++;
    },

    ExportDefaultDeclaration() {
      metrics.exports++;
    },

    FunctionDeclaration() {
      metrics.functions++;
    },

    ArrowFunctionExpression() {
      metrics.functions++;
    },

    ClassDeclaration() {
      metrics.classes++;
    },

    TSInterfaceDeclaration() {
      metrics.interfaces++;
    },
  });

  return metrics;
}

export function extractLineMetrics(
  content: string,
): Pick<
  MetricDto,
  "totalLines" | "codeLines" | "commentLines" | "blankLines"
> {
  const lines = content.split(/\r?\n/);

  let codeLines = 0;
  let commentLines = 0;
  let blankLines = 0;

  let insideBlockComment = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      blankLines++;
      continue;
    }

    if (insideBlockComment) {
      commentLines++;

      if (trimmed.includes("*/")) {
        insideBlockComment = false;
      }

      continue;
    }

    if (trimmed.startsWith("//")) {
      commentLines++;
      continue;
    }

    if (trimmed.startsWith("/*")) {
      commentLines++;

      if (!trimmed.includes("*/")) {
        insideBlockComment = true;
      }

      continue;
    }

    if (trimmed.startsWith("*")) {
      commentLines++;
      continue;
    }

    codeLines++;
  }

  return {
    totalLines: lines.length,
    codeLines,
    commentLines,
    blankLines,
  };
}


export async function gettingMetricsByAnalysis(
  analysisId: mongoose.Types.ObjectId,
) {
  return await getMetricsByAnalysisId(
    analysisId,
  );
}

export async function gettingMetricsByUser(
  userId: mongoose.Types.ObjectId,
) {
  return await getMetricsByUserId(
    userId,
  );
}