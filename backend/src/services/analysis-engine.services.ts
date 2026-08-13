import mongoose from "mongoose";
import { MetricDto } from "../dtos/metrics.dto.js";
import { AnalysisStatus } from "../enum/analysis.dto.js";
import { GeminiProvider } from "../providers/gemini.providers.js";
import { saveAnalysisReport } from "./analysis-report-persistence.services.js";
import { updateStatus } from "./analysis.services.js";
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
  userId: string,
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

  /*
   * Metrics calculated for individual files.
   *
   * These are kept in memory only.
   * They are NOT persisted individually.
   */
  const metricsByPath = new Map<string, MetricDto>();

  /*
   * All file-level metrics that will later be
   * combined into one repository-level aggregate.
   */
  const collectedMetrics: MetricDto[] = [];

  for (const file of files) {
    try {
      console.log("🧠 PARSING FILE:", file.path);

      const fileName = path.basename(file.path).toLowerCase();

      /*
       * package.json is handled separately because it
       * contains metadata rather than source-code AST metrics.
       */
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

      /*
       * Calculate metrics for this individual file.
       *
       * IMPORTANT:
       * We keep these metrics in memory.
       * We do NOT save them to MongoDB.
       */
      const metrics = extractMetrics(ast);

      /*
       * Keep this because your source-prioritization
       * logic uses metricsByPath.
       */
      metricsByPath.set(file.path, metrics);

      /*
       * Add this file's metrics to the collection
       * that will later be aggregated.
       */
      collectedMetrics.push(metrics);

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

  /*
   * At this point every analyzable file has been processed.
   *
   * Now combine all file-level metrics into ONE
   * repository-level metrics object.
   */
  const repositoryMetrics =
    aggregateMetrics(collectedMetrics);

  console.log("📊 REPOSITORY METRICS:", repositoryMetrics);

  /*
   * Persist ONLY the final aggregate.
   *
   * There will be one Metrics document for this analysis.
   */
  await saveMetrics(
    analysisId,
    repositoryMetrics,
  );

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

  console.log(
    "========================== un-persisted data from metrics ===================================",
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

  console.log(
    "======================== analysisContext ==========================",
  );

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
      userId,
      llmResult,
    );

  const objectId =
    new mongoose.Types.ObjectId(
      analysisId,
    );

  await updateStatus(
    objectId,
    AnalysisStatus.COMPLETED,
    report._id.toString(),
  );

  console.log("🔥 ANALYSIS ENGINE FINISHED");

  return {
    analysisContext,
    report,
  };
}