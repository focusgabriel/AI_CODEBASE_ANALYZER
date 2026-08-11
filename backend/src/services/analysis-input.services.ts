import type {
  RepositoryAnalysisDto,
} from "../dtos/repository-analysis.dto.js";

export interface AnalysisInput {
  analysisId: string;

  repository: {
    totalFiles: number;
    metrics: RepositoryAnalysisDto["repositoryMetrics"];
    structure: RepositoryAnalysisDto["repositoryStructure"];
  };

  packages: {
    manifests: RepositoryAnalysisDto["packageMetadataFiles"];
    technologyProfiles: RepositoryAnalysisDto["technologyProfiles"];
    technologies: RepositoryAnalysisDto["repositoryTechnologies"];
  };
}

export function buildAnalysisInput(
  context: RepositoryAnalysisDto,
): AnalysisInput {
  return {
    analysisId: context.analysisId,

    repository: {
      totalFiles: context.totalFiles,
      metrics: context.repositoryMetrics,
      structure: context.repositoryStructure,
    },

    packages: {
      manifests: context.packageMetadataFiles,
      technologyProfiles: context.technologyProfiles,
      technologies: context.repositoryTechnologies,
    },
  };
}