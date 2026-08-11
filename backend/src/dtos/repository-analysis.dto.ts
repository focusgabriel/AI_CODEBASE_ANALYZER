import { PackageMetadata } from "../services/package-metadata.services.js";
import {
  TechnologyProfile,
} from "../services/technology-detection.services.js";
import {
  RepositoryTechnologyProfile,
} from "../services/technology-aggregation.services.js";
import { MetricDto } from "./metrics.dto.js";
import { RepositoryStructure } from "../services/repository-structure.services.js";

export interface PackageMetadataEntry {
  path: string;
  metadata: PackageMetadata;
}

export interface TechnologyProfileEntry {
  path: string;
  technologies: TechnologyProfile;
}

export interface RepositoryAnalysisDto {
  analysisId: string;

  totalFiles: number;

  repositoryMetrics: MetricDto;

  packageMetadataFiles: PackageMetadataEntry[];

  technologyProfiles: TechnologyProfileEntry[];

  repositoryTechnologies: RepositoryTechnologyProfile;

  repositoryStructure: RepositoryStructure;
}