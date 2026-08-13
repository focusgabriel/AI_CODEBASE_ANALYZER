import traverseModule from "@babel/traverse";
import { getMetricsByAnalysisId } from "../repositories/metrics.repository.js";

const traverse =
  (traverseModule as any).default ?? traverseModule;

export function extractMetrics(ast: any) {
  const metrics = {
    imports: 0,
    exports: 0,
    functions: 0,
    classes: 0,
    interfaces: 0,
    // types: 0,
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

    // TSTypeAliasDeclaration() {
    //   metrics.types++;
    // }
  });

  return metrics;
}

export async function gettingMetricsByAnalysis(analysisId:string){
  return await getMetricsByAnalysisId(analysisId);
}