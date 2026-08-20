import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Braces,
  Code2,
  FileCode2,
  FileText,
  FunctionSquare,
  GitBranch,
  Layers,
  Loader,
  LoaderCircle,
  Package,
  TrendingUp,
  Type,
} from "lucide-react";

import MetricCard from "../components/MetricCard";
import ScoreTrendChart from "../components/ScoreTrendChart";
import AnalysisSelector from "../components/AnalysisSelector";
import type { RepositoryMetrics, ScoreTrend } from "../types/metrics";
import { getMetrics, getScoreTrend } from "../services/metrics.service";
import CodeComposition from "../components/codeComposition";
import CodeStructureChart from "../components/codeStructures";
import type { Analysis } from "../types/dashboard";

interface AnalysisProps {
  getAnalysis: Analysis[];
  initialAnalysisId?: string;
}

export default function Metrics({
  getAnalysis,
  initialAnalysisId,
}: AnalysisProps) {
  const newAnalysis: Analysis[] = Array.isArray(getAnalysis) ? getAnalysis : [];

  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>(
    initialAnalysisId ?? newAnalysis[0]?._id ?? "",
  );

  const [metrics, setMetrics] = useState<RepositoryMetrics | null>(null);
  const [scoreTrend, setScoreTrend] = useState<ScoreTrend | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [trendLoading, setTrendLoading] = useState(true);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [trendError, setTrendError] = useState<string | null>(null);

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

        const response = await getMetrics(selectedAnalysisId);
        setMetrics(response.metrics);
      } catch (error) {
        console.error("Failed to load repository metrics:", error);
        setMetrics(null);
        setMetricsError("Failed to load metrics for this analysis.");
      } finally {
        setMetricsLoading(false);
      }
    }

    loadMetrics();
  }, [selectedAnalysisId]);

  useEffect(() => {
    async function loadScoreTrend() {
      try {
        setTrendLoading(true);
        setTrendError(null);

        const response = await getScoreTrend();
        setScoreTrend(response.data);
      } catch (error) {
        console.error("Failed to load score trend:", error);
        setScoreTrend(null);
        setTrendError("Failed to load score history.");
      } finally {
        setTrendLoading(false);
      }
    }

    loadScoreTrend();
  }, []);

  // Derive summary stats for the hero section
  const summary = useMemo(() => {
    if (!metrics) return null;

    const total = metrics.totalLines || 1;
    const codePct = (metrics.codeLines / total) * 100;
    const commentPct = (metrics.commentLines / total) * 100;
    const blankPct = (metrics.blankLines / total) * 100;

    return {
      total,
      codePct,
      commentPct,
      blankPct,
      codeLines: metrics.codeLines,
      commentLines: metrics.commentLines,
      blankLines: metrics.blankLines,
      functions: metrics.functions,
      classes: metrics.classes,
      interfaces: metrics.interfaces,
      imports: metrics.imports,
      exports: metrics.exports,
    };
  }, [metrics]);

  // While analyses are still loading (undefined/null), show a skeleton
  // instead of prematurely displaying the "no analyses" warning.
  if (!getAnalysis) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="border-b border-slate-200 pb-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-indigo-500">
                <span className="h-px w-6 bg-indigo-300" />
                Repository Metrics
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Codebase Intelligence
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
                Structural metrics of the analyzed codebase — line counts,
                composition, and detected elements.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 justify-center flex-col flex items-center">
          {/* <MetricsSkeleton /> */}
          <LoaderCircle className="h-6 w-6 animate-spin text-indigo-500 aria-hidden:true" />
          <p className="text-sm font-medium text-slate-500"> Loading Metrics...</p>
        </div>
      </main>
    );
  }

  if (getAnalysis.length === 0) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="max-w-md rounded-xl border border-slate-200 bg-white p-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <BarChart3 className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-slate-900">
            No analyses available
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Create an analysis before viewing metrics.
          </p>
        </div>
      </main>
    );
  }

  return (
    
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Document Header ─────────────────────────────────────── */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-indigo-500">
              <span className="h-px w-6 bg-indigo-300" />
              Repository Metrics
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Codebase Intelligence
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
              Structural metrics of the analyzed codebase — line counts,
              composition, and detected elements.
            </p>
          </div>

          {/* Analysis selector */}
          <div className="w-full max-w-sm shrink-0">
            <AnalysisSelector
              analyses={getAnalysis}
              selectedAnalysisId={selectedAnalysisId}
              onChange={setSelectedAnalysisId}
            />
          </div>
        </div>
      </div>

      {/* ── Metrics Error ───────────────────────────────────────── */}
      {metricsError && (
        <div className="mt-6 flex items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <Activity className="h-4 w-4 shrink-0" />
          {metricsError}
        </div>
      )}

      {/* ── Analysis-Specific Metrics ───────────────────────────── */}
      {metricsLoading ? (
        <MetricsSkeleton />
      ) : metrics && summary ? (
        <>
          {/* Section label */}
          <div className="mt-8 mb-4 flex items-center gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
              Line Metrics
            </h2>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <MetricCard
              label="Total Lines"
              value={metrics.totalLines.toLocaleString()}
              description="All analyzed lines"
              icon={FileText}
              accent="bg-indigo-500"
              iconBg="bg-indigo-50 text-indigo-600"
            />
            <MetricCard
              label="Code Lines"
              value={metrics.codeLines.toLocaleString()}
              description="Lines containing code"
              icon={Code2}
              accent="bg-sky-500"
              // iconBg="bg-sky-50 text-sky-600"
            />
            <MetricCard
              label="Comment Lines"
              value={metrics.commentLines.toLocaleString()}
              description="Lines containing comments"
              icon={FileCode2}
              accent="bg-amber-500"
              iconBg="bg-amber-50 text-amber-600"
            />
            <MetricCard
              label="Blank Lines"
              value={metrics.blankLines.toLocaleString()}
              description="Empty lines"
              icon={Braces}
              accent="bg-slate-400"
              iconBg="bg-slate-100 text-slate-500"
            />
            <MetricCard
              label="Imports"
              value={metrics.imports.toLocaleString()}
              description="Import declarations"
              icon={Package}
              accent="bg-emerald-500"
              iconBg="bg-emerald-50 text-emerald-600"
            />
          </div>

          {/* Section label */}
          <div className="mt-8 mb-4 flex items-center gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
              Structural Elements
            </h2>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <MetricCard
              label="Exports"
              value={metrics.exports.toLocaleString()}
              description="Export declarations"
              icon={GitBranch}
              accent="bg-rose-500"
              iconBg="bg-rose-50 text-rose-600"
            />
            <MetricCard
              label="Functions"
              value={metrics.functions.toLocaleString()}
              description="Functions detected"
              icon={FunctionSquare}
              accent="bg-violet-500"
              iconBg="bg-violet-50 text-violet-600"
            />
            <MetricCard
              label="Classes"
              value={metrics.classes.toLocaleString()}
              description="Classes detected"
              icon={Layers}
              accent="bg-cyan-500"
              iconBg="bg-cyan-50 text-cyan-600"
            />
            <MetricCard
              label="Interfaces"
              value={metrics.interfaces.toLocaleString()}
              description="Interfaces detected"
              icon={Type}
              accent="bg-fuchsia-500"
              iconBg="bg-fuchsia-50 text-fuchsia-600"
            />
          </div>

          {/* Composition + Structure two-column */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <CodeComposition metrics={metrics} />
            <CodeStructureChart metrics={metrics} />
          </div>
        </>
      ) : null}

      {/* ── Score History ───────────────────────────────────────── */}
      <div className="mt-8">
        {trendLoading ? (
          <div className="h-[420px] animate-pulse rounded-xl bg-slate-100" />
        ) : trendError ? (
          <div className="flex items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <Activity className="h-4 w-4 shrink-0" />
            {trendError}
          </div>
        ) : scoreTrend && scoreTrend.trend.length > 0 ? (
          <ScoreTrendChart scoreTrend={scoreTrend} />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                No score history
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Run more analyses to see your score progression.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-24 rounded-xl bg-slate-100" />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 rounded-xl bg-slate-100" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-64 rounded-xl bg-slate-100" />
        <div className="h-80 rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}