import traverse from "@babel/traverse";

export function extractMetrics(ast: any) {
  const metrics = {
    imports: 0,
    exports: 0,
    functions: 0,
    classes: 0,
    interfaces: 0,
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