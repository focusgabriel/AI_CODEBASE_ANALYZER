import type { MetricDto } from "../dtos/metrics.dto.js";
import type { AnalysisSourceFile } from "./source-selection.services.js";

export interface PrioritizedSourceFile
  extends AnalysisSourceFile {
  priority: number;
}

export function prioritizeSourceFiles(
  files: AnalysisSourceFile[],
  metricsByPath: Map<string, MetricDto>,
  entryPoints: Set<string>,
): PrioritizedSourceFile[] {
  return files
    .map((file) => {
      let priority = 0;

      // Entry points are the most important files.
      if (entryPoints.has(file.path)) {
        priority += 100;
      }

      const metrics = metricsByPath.get(file.path);

      if (metrics) {
        // Files containing more functions/classes/interfaces
        // generally contain more application logic.
        priority += metrics.functions * 3;
        priority += metrics.classes * 5;
        priority += metrics.interfaces * 2;
        // priority += metrics.types * 2;

        // Files importing other modules are more likely
        // to participate in application architecture.
        priority += metrics.imports * 2;

        priority += metrics.exports * 2;
      }
      

      return {
        ...file,
        priority,
      };
    })
    .sort((a, b) => b.priority - a.priority);
}