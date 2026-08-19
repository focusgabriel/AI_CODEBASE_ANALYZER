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
  Package,
  Sparkles,
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

  if (!getAnalysis?.length) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="max-w-md rounded-3xl border border-slate-200/80 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30">
            <BarChart3 className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
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
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* ── Hero Header ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-6 py-8 sm:px-10 sm:py-10">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="pointer-events-none absolute right-1/3 top-0 h-40 w-40 rounded-full bg-sky-500/10 blur-2xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-300 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Repository Metrics
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Codebase{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-sky-400 bg-clip-text text-transparent">
                Intelligence
              </span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-[15px]">
              Deep-dive into the structural metrics of your analyzed codebase —
              from line counts to structural elements.
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
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
          <Activity className="h-5 w-5 shrink-0" />
          {metricsError}
        </div>
      )}

      {/* ── Analysis-Specific Metrics ───────────────────────────── */}
      {metricsLoading ? (
        <MetricsSkeleton />
      ) : metrics && summary ? (
        <>
          {/* KPI Cards */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <MetricCard
              label="Total Lines"
              value={metrics.totalLines.toLocaleString()}
              description="All analyzed lines"
              icon={FileText}
              gradient="from-indigo-500 to-violet-500"
              shadow="shadow-indigo-500/20"
            />
            <MetricCard
              label="Code Lines"
              value={metrics.codeLines.toLocaleString()}
              description="Lines containing code"
              icon={Code2}
              gradient="from-sky-500 to-blue-500"
              shadow="shadow-sky-500/20"
            />
            <MetricCard
              label="Comment Lines"
              value={metrics.commentLines.toLocaleString()}
              description="Lines containing comments"
              icon={FileCode2}
              gradient="from-amber-500 to-orange-500"
              shadow="shadow-amber-500/20"
            />
            <MetricCard
              label="Blank Lines"
              value={metrics.blankLines.toLocaleString()}
              description="Empty lines"
              icon={Braces}
              gradient="from-slate-500 to-slate-600"
              shadow="shadow-slate-500/20"
            />
            <MetricCard
              label="Imports"
              value={metrics.imports.toLocaleString()}
              description="Import declarations"
              icon={Package}
              gradient="from-emerald-500 to-green-500"
              shadow="shadow-emerald-500/20"
            />
            <MetricCard
              label="Exports"
              value={metrics.exports.toLocaleString()}
              description="Export declarations"
              icon={GitBranch}
              gradient="from-rose-500 to-red-500"
              shadow="shadow-rose-500/20"
            />
            <MetricCard
              label="Functions"
              value={metrics.functions.toLocaleString()}
              description="Functions detected"
              icon={FunctionSquare}
              gradient="from-violet-500 to-purple-500"
              shadow="shadow-violet-500/20"
            />
            <MetricCard
              label="Classes"
              value={metrics.classes.toLocaleString()}
              description="Classes detected"
              icon={Layers}
              gradient="from-cyan-500 to-teal-500"
              shadow="shadow-cyan-500/20"
            />
            <MetricCard
              label="Interfaces"
              value={metrics.interfaces.toLocaleString()}
              description="Interfaces detected"
              icon={Type}
              gradient="from-fuchsia-500 to-pink-500"
              shadow="shadow-fuchsia-500/20"
            />
          </div>

          {/* Composition + Structure two-column */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <CodeComposition metrics={metrics} />
            <CodeStructureChart metrics={metrics} />
          </div>
        </>
      ) : null}

      {/* ── Score History ───────────────────────────────────────── */}
      <div className="mt-6">
        {trendLoading ? (
          <div className="h-[420px] animate-pulse rounded-3xl bg-slate-200/60" />
        ) : trendError ? (
          <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
            <Activity className="h-5 w-5 shrink-0" />
            {trendError}
          </div>
        ) : scoreTrend && scoreTrend.trend.length > 0 ? (
          <ScoreTrendChart scoreTrend={scoreTrend} />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200/80 bg-white px-6 py-16 text-center shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30">
              <TrendingUp className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
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
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="h-32 rounded-2xl bg-slate-200/60" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-64 rounded-2xl bg-slate-200/60" />
        <div className="h-80 rounded-2xl bg-slate-200/60" />
      </div>
    </div>
  );
}