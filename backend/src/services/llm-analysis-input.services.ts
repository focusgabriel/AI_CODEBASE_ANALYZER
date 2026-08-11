
import { RepositoryAnalysisContextDto } from "../dtos/repository-analysis-context.services.js";
import type { PrioritizedSourceFile } from "./source-prioritization.services.js";

export interface LlmAnalysisInput {
  analysisId: string;

  repository: {
    totalFiles: number;
    metrics: RepositoryAnalysisContextDto["repository"]["metrics"];
    structure: RepositoryAnalysisContextDto["repository"]["structure"];
  };

  packages: {
    manifests: RepositoryAnalysisContextDto["packages"]["manifests"];
    technologyProfiles: RepositoryAnalysisContextDto["packages"]["technologyProfiles"];
    technologies: RepositoryAnalysisContextDto["packages"]["technologies"];
  };

  sourceFiles: {
    path: string;
    content: string;
    priority: number;
  }[];
}

export function buildLlmAnalysisInput(
  context: RepositoryAnalysisContextDto,
  sourceFiles: PrioritizedSourceFile[],
): LlmAnalysisInput {
  return {
    analysisId: context.analysisId,

    repository: {
      totalFiles: context.repository.totalFiles,
      metrics: context.repository.metrics,
      structure: context.repository.structure,
    },

    packages: {
      manifests: context.packages.manifests,
      technologyProfiles: context.packages.technologyProfiles,
      technologies: context.packages.technologies,
    },
    
    sourceFiles: sourceFiles.map((file) => ({
      path: file.path,
      content: file.content,
      priority: file.priority,
    })),
  };
}