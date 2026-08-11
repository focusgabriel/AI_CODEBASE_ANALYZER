import { TechnologyProfile } from "./technology-detection.services.js";

export interface RepositoryTechnologyProfile {
  languages: string[];
  runtime: string[];
  frameworks: string[];
  libraries: string[];
  databases: string[];
  buildTools: string[];
  testing: string[];
  unknownPackages: string[];
}

export function aggregateTechnologyProfiles(
  profiles: {
    path: string;
    technologies: TechnologyProfile;
  }[],
): RepositoryTechnologyProfile {
  const repositoryProfile: RepositoryTechnologyProfile = {
    languages: [],
    runtime: [],
    frameworks: [],
    libraries: [],
    databases: [],
    buildTools: [],
    testing: [],
    unknownPackages: [],
  };

  for (const profile of profiles) {
    const technologies = profile.technologies;

    repositoryProfile.languages.push(...technologies.languages);
    repositoryProfile.runtime.push(...technologies.runtime);
    repositoryProfile.frameworks.push(...technologies.frameworks);
    repositoryProfile.libraries.push(...technologies.libraries);
    repositoryProfile.databases.push(...technologies.databases);
    repositoryProfile.buildTools.push(...technologies.buildTools);
    repositoryProfile.testing.push(...technologies.testing);
    repositoryProfile.unknownPackages.push(...technologies.unknownPackages);
  }

  return {
    languages: [...new Set(repositoryProfile.languages)],
    runtime: [...new Set(repositoryProfile.runtime)],
    frameworks: [...new Set(repositoryProfile.frameworks)],
    libraries: [...new Set(repositoryProfile.libraries)],
    databases: [...new Set(repositoryProfile.databases)],
    buildTools: [...new Set(repositoryProfile.buildTools)],
    testing: [...new Set(repositoryProfile.testing)],
    unknownPackages: [...new Set(repositoryProfile.unknownPackages)],
  };
}