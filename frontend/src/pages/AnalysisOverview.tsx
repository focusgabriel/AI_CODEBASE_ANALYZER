import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  Code2,
  FileCode2,
  FileText,
  FunctionSquare,
  GitBranch,
  Layers,
  Package,
  Shield,
  Sparkles,
  Type,
} from "lucide-react";
import api from "../api/fetch";

interface Analysis {
  name: string;
  status: string;
  sourceType: string;
  reportId: string;
  createdAt: string;
}

interface Metrics {
  totalLines: number;
  codeLines: number;
  commentLines: number;
  blankLines: number;
  imports: number;
  exports: number;
  functions: number;
  classes: number;
  interfaces: number;
}

interface Report {
  scores: {
    architecture: number;
    codeQuality: number;
    technologies: number;
    security: number;
    overall: number;
  };

  architecture: {
    overview: string;
    patterns: string[];
    concerns: string[];
  };

  codeQuality: {
    strengths: string[];
    weaknesses: string[];
  };

  technologies: {
    strengths: string[];
    concerns: string[];
  };

  security: {
    findings: string[];
    recommendations: string[];
  };

  risks: string[];

  summary: string;

  createdAt: string;
  updatedAt: string;
}

export default function AnalysisOverview() {
  const { analysisId } = useParams<{ analysisId: string }>();

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!analysisId) {
      setError("Analysis ID is missing.");
      setLoading(false);
      return;
    }

    async function loadOverview() {
      try {
        setLoading(true);
        setError(null);

        const analysisResponse = await api.get(`/analyses/${analysisId}`);
        const analysisData = analysisResponse.data.data;
        setAnalysis(analysisData);

        const reportResponse = await api.get(`/reports/${analysisId}`);
        setReport(reportResponse.data.data);

        const metricsResponse = await api.get(`/metrics/${analysisId}`);
        setMetrics(metricsResponse.data.metrics);
      } catch (error) {
        console.error("Failed to load analysis overview:", error);
        setError("Failed to load this analysis.");
      } finally {
        setLoading(false);
      }
    }

    loadOverview();
  }, [analysisId]);

  if (loading) {
    return <OverviewSkeleton />;
  }

  if (error) {
    return (
      <main className="p-6">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
          <h2 className="font-semibold text-rose-700">Unable to load analysis</h2>
          <p className="mt-1 text-sm text-rose-600">{error}</p>
        </div>
      </main>
    );
  }

  if (!analysis || !report) {
    return (
      <main className="p-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <h2 className="font-semibold text-slate-900">Analysis data unavailable</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Hero Header ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Subtle decorative gradient */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-indigo-50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-slate-50 blur-3xl" />

        <div className="relative flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-indigo-500">
              <span className="h-px w-6 bg-indigo-300" />
              Analysis Overview
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {analysis.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-500">
              <span>{formatDate(analysis.createdAt)}</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="capitalize">{analysis.status.toLowerCase()}</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>{analysis.sourceType}</span>
            </div>
          </div>

          <ScoreDisplay score={report.scores.overall} />
        </div>
      </section>

      {/* ── Score Breakdown ─────────────────────────────────────── */}
      <section>
        <SectionHeader
          title="Score Breakdown"
          description="How this repository performed across the major analysis categories."
        />

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ScoreCard label="Architecture" score={report.scores.architecture} />
          <ScoreCard label="Code Quality" score={report.scores.codeQuality} />
          <ScoreCard label="Technologies" score={report.scores.technologies} />
          <ScoreCard label="Security" score={report.scores.security} />
        </div>
      </section>

      {/* ── Repository Snapshot ─────────────────────────────────── */}
      {metrics && (
        <section>
          <SectionHeader
            title="Repository Snapshot"
            description="A quick look at the structure and size of the analyzed codebase."
          />

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <MetricCard label="Total Lines" value={metrics.totalLines} icon={FileText} />
            <MetricCard label="Code Lines" value={metrics.codeLines} icon={Code2} />
            <MetricCard label="Comments" value={metrics.commentLines} icon={FileCode2} />
            <MetricCard label="Functions" value={metrics.functions} icon={FunctionSquare} />
            <MetricCard label="Imports" value={metrics.imports} icon={Package} />
            <MetricCard label="Exports" value={metrics.exports} icon={GitBranch} />
            <MetricCard label="Classes" value={metrics.classes} icon={Layers} />
            <MetricCard label="Interfaces" value={metrics.interfaces} icon={Type} />
          </div>
        </section>
      )}

      {/* ── AI Summary ──────────────────────────────────────────── */}
      <section className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 via-white to-white p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900">AI Analysis Summary</h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
              {report.summary}
            </p>
          </div>
        </div>
      </section>

      {/* ── Architecture ────────────────────────────────────────── */}
      <section>
        <SectionHeader
          title="Architecture"
          description={report.architecture.overview}
        />

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <InsightList
            title="Patterns"
            items={report.architecture.patterns}
            icon={CheckCircle2}
            iconClass="bg-emerald-50 text-emerald-600"
            dotClass="bg-emerald-500"
          />
          <InsightList
            title="Concerns"
            items={report.architecture.concerns}
            icon={AlertTriangle}
            iconClass="bg-amber-50 text-amber-600"
            dotClass="bg-amber-500"
          />
        </div>
      </section>

      {/* ── Code Quality ────────────────────────────────────────── */}
      <section>
        <SectionHeader
          title="Code Quality"
          description="Strengths and areas for improvement in the codebase."
        />

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <InsightList
            title="Strengths"
            items={report.codeQuality.strengths}
            icon={CheckCircle2}
            iconClass="bg-emerald-50 text-emerald-600"
            dotClass="bg-emerald-500"
          />
          <InsightList
            title="Weaknesses"
            items={report.codeQuality.weaknesses}
            icon={AlertTriangle}
            iconClass="bg-amber-50 text-amber-600"
            dotClass="bg-amber-500"
          />
        </div>
      </section>

      {/* ── Security ────────────────────────────────────────────── */}
      <section>
        <SectionHeader
          title="Security"
          description="Security findings and recommended actions."
        />

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <InsightList
            title="Findings"
            items={report.security.findings}
            icon={Shield}
            iconClass="bg-rose-50 text-rose-600"
            dotClass="bg-rose-500"
          />
          <InsightList
            title="Recommendations"
            items={report.security.recommendations}
            icon={CheckCircle2}
            iconClass="bg-emerald-50 text-emerald-600"
            dotClass="bg-emerald-500"
          />
        </div>
      </section>

      {/* ── Technologies ────────────────────────────────────────── */}
      <section>
        <SectionHeader
          title="Technologies"
          description="Technology stack strengths and concerns."
        />

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <InsightList
            title="Strengths"
            items={report.technologies.strengths}
            icon={CheckCircle2}
            iconClass="bg-emerald-50 text-emerald-600"
            dotClass="bg-emerald-500"
          />
          <InsightList
            title="Concerns"
            items={report.technologies.concerns}
            icon={AlertTriangle}
            iconClass="bg-amber-50 text-amber-600"
            dotClass="bg-amber-500"
          />
        </div>
      </section>

      {/* ── Risks ───────────────────────────────────────────────── */}
      {report.risks.length > 0 && (
        <section className="overflow-hidden rounded-2xl border border-rose-200 bg-rose-50/50 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold text-rose-900">Detected Risks</h2>
              <div className="mt-4 space-y-3">
                {report.risks.map((risk, index) => (
                  <div key={`${risk}-${index}`} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                    <p className="text-sm leading-6 text-rose-800">{risk}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

/* ─────────────────────────────── */
/* COMPONENTS                      */
/* ─────────────────────────────── */

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
  );
}

function ScoreDisplay({ score }: { score: number }) {
  return (
    <div className="shrink-0 rounded-2xl border border-slate-200 bg-white px-8 py-6 text-center shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
        Overall Score
      </p>
      <p className="mt-2 text-5xl font-bold tracking-tight text-indigo-600">
        {score.toFixed(1)}
      </p>
      <span className="mt-3 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
        {getScoreLabel(score)}
      </span>
    </div>
  );
}

function ScoreCard({ label, score }: { label: string; score: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-slate-300 hover:shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <p className="text-xl font-bold text-slate-900">{score}</p>
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-500"
          style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
        />
      </div>

      <p className="mt-2 text-xs font-medium text-slate-400">{getScoreLabel(score)}</p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon?: typeof FileText;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-sm">
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium uppercase tracking-wider text-slate-400">
            {label}
          </p>
          <p className="mt-0.5 text-lg font-semibold text-slate-900">
            {value.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

function InsightList({
  title,
  items,
  icon: Icon,
  iconClass,
  dotClass,
}: {
  title: string;
  items: string[];
  icon?: typeof CheckCircle2;
  iconClass?: string;
  dotClass?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconClass ?? "bg-slate-50 text-slate-500"}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((item, index) => (
          <div key={`${item}-${index}`} className="flex gap-3">
            <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dotClass ?? "bg-slate-400"}`} />
            <p className="text-sm leading-6 text-slate-600">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function getScoreLabel(score: number) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs Work";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function OverviewSkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl animate-pulse space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-40 rounded-2xl bg-slate-100" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 rounded-xl bg-slate-100" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-24 rounded-xl bg-slate-100" />
        ))}
      </div>
      <div className="h-40 rounded-2xl bg-slate-100" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-48 rounded-xl bg-slate-100" />
        <div className="h-48 rounded-xl bg-slate-100" />
      </div>
    </main>
  );
}