import path from "node:path";

export interface RepositoryStructure {
  totalFiles: number;
  sourceFiles: number;
  testFiles: number;
  configFiles: number;
  documentationFiles: number;

  fileTypes: Record<string, number>;
  directories: Record<string, number>;

  entryPoints: string[];
  testFilesPaths: string[];
  configFilesPaths: string[];

  maxDirectoryDepth: number;
}

interface AnalysisFile {
  path: string;
  extension: string;
  language: string;
}

const SOURCE_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".mjs",
  ".cjs",
]);

const CONFIG_FILES = new Set([
  "package.json",
  "tsconfig.json",
  "vite.config.js",
  "vite.config.ts",
  "next.config.js",
  "next.config.ts",
  "webpack.config.js",
  "webpack.config.ts",
  "eslint.config.js",
  "eslint.config.mjs",
  "jest.config.js",
  "jest.config.ts",
]);

const DOCUMENTATION_EXTENSIONS = new Set([
  ".md",
  ".mdx",
]);

export function analyzeRepositoryStructure(
  files: AnalysisFile[],
): RepositoryStructure {
  const structure: RepositoryStructure = {
    totalFiles: files.length,
    sourceFiles: 0,
    testFiles: 0,
    configFiles: 0,
    documentationFiles: 0,

    fileTypes: {},
    directories: {},

    entryPoints: [],
    testFilesPaths: [],
    configFilesPaths: [],

    maxDirectoryDepth: 0,
  };

  for (const file of files) {
    const extension = file.extension.toLowerCase();
    const fileName = path.basename(file.path).toLowerCase();

    structure.fileTypes[extension || "[no extension]"] =
      (structure.fileTypes[extension || "[no extension]"] ?? 0) + 1;

    const directory = path.dirname(file.path);

    structure.directories[directory] =
      (structure.directories[directory] ?? 0) + 1;

    const depth = getDirectoryDepth(file.path);

    structure.maxDirectoryDepth = Math.max(
      structure.maxDirectoryDepth,
      depth,
    );

    if (SOURCE_EXTENSIONS.has(extension)) {
      structure.sourceFiles++;
    }

    if (isTestFile(fileName)) {
      structure.testFiles++;
      structure.testFilesPaths.push(file.path);
    }

    if (CONFIG_FILES.has(fileName)) {
      structure.configFiles++;
      structure.configFilesPaths.push(file.path);
    }

    if (DOCUMENTATION_EXTENSIONS.has(extension)) {
      structure.documentationFiles++;
    }

    if (isEntryPoint(fileName)) {
      structure.entryPoints.push(file.path);
    }
  }

  return structure;
}

function isTestFile(fileName: string): boolean {
  return (
    fileName.includes(".test.") ||
    fileName.includes(".spec.") ||
    fileName.startsWith("test.") ||
    fileName.startsWith("tests.")
  );
}

function isEntryPoint(fileName: string): boolean {
  return new Set([
    "index.js",
    "index.jsx",
    "index.ts",
    "index.tsx",
    "main.js",
    "main.jsx",
    "main.ts",
    "main.tsx",
    "server.js",
    "server.ts",
    "app.js",
    "app.ts",
  ]).has(fileName);
}

function getDirectoryDepth(filePath: string): number {
  return filePath.split(path.sep).length - 1;
}