import { RepositoryAnalysisContextDto } from "../dtos/repository-analysis-context.services.js";
import type { RepositoryAnalysisDto } from "../dtos/repository-analysis.dto.js";


export function buildRepositoryAnalysisContext(
  data: RepositoryAnalysisDto,
): RepositoryAnalysisContextDto {
  return {
    analysisId: data.analysisId,

    repository: {
      totalFiles: data.totalFiles,
      metrics: data.repositoryMetrics,
      structure: data.repositoryStructure,
    },

    packages: {
      manifests: data.packageMetadataFiles,
      technologyProfiles: data.technologyProfiles,
      technologies: data.repositoryTechnologies,
    },
  };
}