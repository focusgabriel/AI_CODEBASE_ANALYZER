import { useEffect, useState } from "react";

import MetricCard from "../components/MetricCard";
import ScoreTrendChart from "../components/ScoreTrendChart";
import AnalysisSelector, {
  type AnalysisOption,
} from "../components/AnalysisSelector";
import type { RepositoryMetrics, ScoreTrend } from "../types/metrics";
import { getMetrics, getScoreTrend } from "../services/metrics.service";
import CodeComposition from "../components/codeComposition";
import CodeStructureChart from "../components/codeStructures";


interface MetricsProps {
  analyses: AnalysisOption[];
  initialAnalysisId?: string;
}

export default function Metrics({
  analyses,
  initialAnalysisId,
}: MetricsProps) {
  const [selectedAnalysisId, setSelectedAnalysisId] =
    useState(
      initialAnalysisId ??
        analyses[0]?._id ??
        "",
    );

  const [metrics, setMetrics] =
    useState<RepositoryMetrics | null>(null);

  const [scoreTrend, setScoreTrend] =
    useState<ScoreTrend | null>(null);

  const [metricsLoading, setMetricsLoading] =
    useState(true);

  const [trendLoading, setTrendLoading] =
    useState(true);

  const [metricsError, setMetricsError] =
    useState<string | null>(null);

  const [trendError, setTrendError] =
    useState<string | null>(null);

  /*
   * Load the metrics for the selected analysis.
   *
   * This runs whenever selectedAnalysisId changes.
   */
  useEffect(() => {
    if (!selectedAnalysisId) {
      setMetrics(null);
      setMetricsLoading(false);
      return;
    }

    async function loadMetrics() {
      try {
        setMetricsLoading(true);
        setMetricsError(null);

        const response =
          await getMetrics(
            selectedAnalysisId,
          );

        setMetrics(response.metrics);
      } catch (error) {
        console.error(
          "Failed to load repository metrics:",
          error,
        );

        setMetrics(null);

        setMetricsError(
          "Failed to load metrics for this analysis.",
        );
      } finally {
        setMetricsLoading(false);
      }
    }

    loadMetrics();
  }, [selectedAnalysisId]);

  /*
   * Load score trend once.
   *
   * Changing the selected analysis does NOT
   * trigger this request again.
   */
  useEffect(() => {
    async function loadScoreTrend() {
      try {
        setTrendLoading(true);
        setTrendError(null);

        const response =
          await getScoreTrend();

        setScoreTrend(response.data);
      } catch (error) {
        console.error(
          "Failed to load score trend:",
          error,
        );

        setScoreTrend(null);

        setTrendError(
          "Failed to load score history.",
        );
      } finally {
        setTrendLoading(false);
      }
    }

    loadScoreTrend();
  }, []);

  if (!analyses?.length) {
    return (
      <main className="p-6">
        <div className="rounded-2xl border border-[#ECECF4] bg-white p-8 text-center">
          <h2 className="font-semibold text-[#202033]">
            No analyses available
          </h2>

          <p className="mt-1 text-sm text-[#777791]">
            Create an analysis before viewing metrics.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-6 p-6">

      {/* HEADER */}
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-[#202033]">
            Metrics
          </h1>

          <p className="mt-1 text-sm text-[#777791]">
            Detailed measurements from your analyzed codebase.
          </p>
        </div>

        <AnalysisSelector
          analyses={analyses}
          selectedAnalysisId={
            selectedAnalysisId
          }
          onChange={
            setSelectedAnalysisId
          }
        />

      </div>

      {/* METRICS ERROR */}
      {metricsError && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {metricsError}
        </div>
      )}

      {/* ANALYSIS-SPECIFIC METRICS */}
      {metricsLoading ? (
        <MetricsSkeleton />
      ) : metrics ? (
        <>
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <MetricCard
              label="Total Lines"
              value={metrics.totalLines.toLocaleString()}
              description="All analyzed lines"
            />

            <MetricCard
              label="Code Lines"
              value={metrics.codeLines.toLocaleString()}
              description="Lines containing code"
            />

            <MetricCard
              label="Comment Lines"
              value={metrics.commentLines.toLocaleString()}
              description="Lines containing comments"
            />

            <MetricCard
              label="Blank Lines"
              value={metrics.blankLines.toLocaleString()}
              description="Empty lines"
            />

            <MetricCard
              label="Imports"
              value={metrics.imports.toLocaleString()}
              description="Import declarations"
            />

            <MetricCard
              label="Exports"
              value={metrics.exports.toLocaleString()}
              description="Export declarations"
            />

            <MetricCard
              label="Functions"
              value={metrics.functions.toLocaleString()}
              description="Functions detected"
            />

            <MetricCard
              label="Classes"
              value={metrics.classes.toLocaleString()}
              description="Classes detected"
            />

            <MetricCard
              label="Interfaces"
              value={metrics.interfaces.toLocaleString()}
              description="Interfaces detected"
            />

          </div>

          {/* CODE COMPOSITION */}
          <CodeComposition
            metrics={metrics}
          />

          {/* CODE STRUCTURE */}
          <CodeStructureChart
            metrics={metrics}
          />
        </>
      ) : null}

      {/* SCORE HISTORY */}
      <section>
        {trendLoading ? (
          <div className="h-[420px] animate-pulse rounded-2xl bg-[#ECECF4]" />
        ) : trendError ? (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {trendError}
          </div>
        ) : scoreTrend &&
          scoreTrend.trend.length > 0 ? (
          <ScoreTrendChart
            scoreTrend={scoreTrend}
          />
        ) : (
          <div className="rounded-2xl border border-[#ECECF4] bg-white p-8 text-center">
            <h2 className="font-semibold text-[#202033]">
              No score history
            </h2>

            <p className="mt-1 text-sm text-[#777791]">
              Run more analyses to see your score progression.
            </p>
          </div>
        )}
      </section>

    </main>
  );
}

function MetricsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 9 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-32 rounded-2xl bg-[#ECECF4]"
            />
          ),
        )}
      </div>

      <div className="h-64 rounded-2xl bg-[#ECECF4]" />

      <div className="h-80 rounded-2xl bg-[#ECECF4]" />

    </div>
  );
}