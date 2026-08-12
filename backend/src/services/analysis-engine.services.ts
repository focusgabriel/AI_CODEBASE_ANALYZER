import { MetricDto } from "../dtos/metrics.dto.js";
import { GeminiProvider } from "../providers/gemini.providers.js";
import { saveAnalysisReport } from "./analysis-report-persistence.services.js";
import { prepareAnalysis } from "./analyzer.services.js";
import { buildLlmAnalysisInput } from "./llm-analysis-input.services.js";
import { analyzeWithLlm } from "./llm-analysis.services.js";
import { aggregateMetrics } from "./metrics-aggregation.services.js";
import { saveMetrics } from "./metrics-persistence.services.js";
import { extractMetrics } from "./metrics.services.js";
import { extractPackageMetadata } from "./package-metadata.services.js";
import { parseFile } from "./parser.services.js";
import { buildRepositoryAnalysisContext } from "./repository-analysis-context.services.js";
import { analyzeRepositoryStructure } from "./repository-structure.services.js";
import { applySourceBudget } from "./sorce-budget.services.js";
import { prioritizeSourceFiles } from "./source-prioritization.services.js";
import { selectSourceFiles } from "./source-selection.services.js";
import { aggregateTechnologyProfiles } from "./technology-aggregation.services.js";
import { detectTechnologies } from "./technology-detection.services.js";
import path from "node:path";

export async function analyzeRepository(
  analysisId: string,
) {
  console.log("🚨🚨 ANALYSIS REQUEST START", {
    analysisId,
    time: new Date().toISOString(),
  });

  const files = await prepareAnalysis(analysisId);

  const repositoryStructure =
    analyzeRepositoryStructure(files);

  console.dir(repositoryStructure, {
    depth: null,
  });

  const packageMetadataFiles: Array<{
    path: string;
    metadata: ReturnType<typeof extractPackageMetadata>;
  }> = [];

  const metricsByPath = new Map<string, MetricDto>();

  for (const file of files) {
    try {
      console.log("🧠 PARSING FILE:", file.path);

      const fileName = path.basename(file.path).toLowerCase();

      if (fileName === "package.json") {
        const metadata = extractPackageMetadata(file.content);

        packageMetadataFiles.push({
          path: file.path,
          metadata,
        });

        console.log("📦 PACKAGE METADATA:", {
          path: file.path,
          metadata,
        });

        continue;
      }

      const ast = parseFile(
        file.extension,
        file.content,
      );

      if (!ast) {
        console.log("⚠️ NO AST:", file.path);
        continue;
      }

      console.log("✅ AST CREATED:", file.path);

      const metrics = extractMetrics(ast);

      metricsByPath.set(file.path, metrics);

      await saveMetrics(
        analysisId,
        file.id.toString(),
        metrics,
      );

      console.log("💾 METRICS SAVED:", file.path);
    } catch (error) {
      console.error("❌ FAILED TO ANALYZE FILE:", {
        path: file.path,
        extension: file.extension,
        language: file.language,
        error,
      });

      continue;
    }
  }

  const repositoryMetrics =
    await aggregateMetrics(analysisId);

  console.log("📊 REPOSITORY METRICS:", repositoryMetrics);

  const selectedSources =
    selectSourceFiles(
      files,
      repositoryStructure,
    );

  const candidateSources = [
    ...selectedSources.entryPoints,
    ...selectedSources.configFiles,
    ...selectedSources.testFiles,
    ...selectedSources.sourceFiles,
  ];

  const prioritizedSources =
    prioritizeSourceFiles(
      candidateSources,
      metricsByPath,
      new Set(repositoryStructure.entryPoints),
    );

  const budgetedSources =
    applySourceBudget(
      prioritizedSources,
      {
        maxFiles: 30,
        maxCharacters: 150_000,
      },
    );

  const uniqueAnalysisSources =
    Array.from(
      new Map(
        budgetedSources.map((file) => [
          file.path,
          file,
        ]),
      ).values(),
    );

  console.log(
    "🎯 SELECTED LLM SOURCES:",
    uniqueAnalysisSources.map((file) => ({
      path: file.path,
      priority: file.priority,
    })),
  );

  const technologyProfiles =
    packageMetadataFiles.map(
      ({ path: packagePath, metadata }) => ({
        path: packagePath,
        technologies: detectTechnologies(metadata),
      }),
    );

  console.dir(technologyProfiles, {
    depth: null,
  });

  const repositoryTechnologies =
    aggregateTechnologyProfiles(
      technologyProfiles,
    );

  const analysisContext =
    buildRepositoryAnalysisContext({
      analysisId,
      totalFiles: files.length,
      repositoryMetrics,
      packageMetadataFiles,
      technologyProfiles,
      repositoryTechnologies,
      repositoryStructure,
    });

  console.dir(analysisContext, {
    depth: null,
  });

  console.log(
    "🌐 REPOSITORY TECHNOLOGIES:",
    repositoryTechnologies,
  );

  const llmInput = buildLlmAnalysisInput(
    analysisContext,
    uniqueAnalysisSources,
  );

  console.dir(
    {
      analysisId: llmInput.analysisId,
      repository: llmInput.repository,
      packages: {
        manifests: llmInput.packages.manifests.length,
        technologies:
          llmInput.packages.technologies,
      },
      selectedSourceFiles:
        llmInput.sourceFiles.length,
    },
    { depth: null },
  );

  const llmProvider =
    new GeminiProvider();

  const llmResult =
    await analyzeWithLlm(
      llmInput,
      llmProvider,
    );

  const report =
    await saveAnalysisReport(
      analysisId,
      llmResult,
    );

  console.log("🔥 ANALYSIS ENGINE FINISHED");

  return {
    analysisContext,
    report,
  };
}
