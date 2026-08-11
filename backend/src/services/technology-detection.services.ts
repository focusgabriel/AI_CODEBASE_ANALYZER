import { TECHNOLOGY_RULES } from "../utils/technology-rules.js";
import { PackageMetadata } from "./package-metadata.services.js";

export interface TechnologyProfile {
  languages: string[];

  runtime: string[];

  frameworks: string[];

  libraries: string[];

  databases: string[];

  buildTools: string[];

  testing: string[];

  unknownPackages: string[];
}

export function detectTechnologies(
  metadata: PackageMetadata,
): TechnologyProfile {
  const profile: TechnologyProfile = {
    languages: [],
    runtime: [],
    frameworks: [],
    libraries: [],
    databases: [],
    buildTools: [],
    testing: [],
    unknownPackages: [],
  };

  const packageNames = new Set([
    ...Object.keys(metadata.dependencies),
    ...Object.keys(metadata.devDependencies),
    ...Object.keys(metadata.peerDependencies),
    ...Object.keys(metadata.optionalDependencies),
  ]);

  for (const packageName of packageNames) {
    const rule =
      TECHNOLOGY_RULES[
      packageName as keyof typeof TECHNOLOGY_RULES
      ];

    if (!rule) {
      profile.unknownPackages.push(packageName);
      continue;
    }

    profile[rule.category].push(rule.name);
  }

  return profile;
}