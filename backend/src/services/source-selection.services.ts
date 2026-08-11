import type { RepositoryStructure } from "./repository-structure.services.js";

export interface AnalysisSourceFile {
  path: string;
  content: string;
}

export interface SelectedSourceFiles {
  entryPoints: AnalysisSourceFile[];
  configFiles: AnalysisSourceFile[];
  testFiles: AnalysisSourceFile[];
  sourceFiles: AnalysisSourceFile[];
}

export function selectSourceFiles(
  files: AnalysisSourceFile[],
  structure: RepositoryStructure,
): SelectedSourceFiles {
  const fileMap = new Map(
    files.map((file) => [file.path, file]),
  );

  const entryPoints = getExistingFiles(
    structure.entryPoints,
    fileMap,
  );

  const configFiles = getExistingFiles(
    structure.configFilesPaths,
    fileMap,
  );

  const testFiles = getExistingFiles(
    structure.testFilesPaths,
    fileMap,
  );

  const priorityPaths = new Set([
    ...entryPoints.map((file) => file.path),
    ...configFiles.map((file) => file.path),
    ...testFiles.map((file) => file.path),
  ]);

  const sourceFiles = files.filter(
    (file) => !priorityPaths.has(file.path),
  );
  

  return {
    entryPoints,
    configFiles,
    testFiles,
    sourceFiles,
  };
}

function getExistingFiles(
  paths: string[],
  fileMap: Map<string, AnalysisSourceFile>,
): AnalysisSourceFile[] {
  return paths
    .map((filePath) => fileMap.get(filePath))
    .filter(
      (file): file is AnalysisSourceFile =>
        file !== undefined,
    );
}