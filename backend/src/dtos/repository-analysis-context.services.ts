import type { PackageMetadataEntry } from "./repository-analysis.dto.js";
import type { TechnologyProfileEntry } from "./repository-analysis.dto.js";
import type { MetricDto } from "./metrics.dto.js";
import type { RepositoryTechnologyProfile } from "../services/technology-aggregation.services.js";
import type { RepositoryStructure } from "../services/repository-structure.services.js";
import mongoose from "mongoose";

export interface RepositoryAnalysisContextDto {
  analysisId: mongoose.Types.ObjectId;

  repository: {
    totalFiles: number;
    metrics: MetricDto;
    structure: RepositoryStructure;
  };

  packages: {
    manifests: PackageMetadataEntry[];
    technologyProfiles: TechnologyProfileEntry[];
    technologies: RepositoryTechnologyProfile;
  };
}