import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  const { analysisId } =
    useParams<{ analysisId: string }>();

  const [analysis, setAnalysis] =
    useState<Analysis | null>(null);

  const [metrics, setMetrics] =
    useState<Metrics | null>(null);

  const [report, setReport] =
    useState<Report | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

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

        /*
         * First get the analysis.
         */
        const analysisResponse =
          await api.get(
            `/analyses/${analysisId}`,
          );

        const analysisData =
          analysisResponse.data.data;

        setAnalysis(analysisData);

        /*
         * Now that we know the reportId,
         * retrieve the report.
         */
        const reportResponse =
          await api.get(
            `/reports/${analysisId}`,
          );

        setReport(
          reportResponse.data.data,
        );

        /*
         * Retrieve repository metrics using
         * the analysisId.
         */
        const metricsResponse =
          await api.get(
            `/metrics/${analysisId}`,
          );

        setMetrics(
          metricsResponse.data.metrics,
        );

      } catch (error) {
        console.error(
          "Failed to load analysis overview:",
          error,
        );

        setError(
          "Failed to load this analysis.",
        );
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
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <h2 className="font-semibold text-red-700">
            Unable to load analysis
          </h2>

          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>
        </div>
      </main>
    );
  }

  if (!analysis || !report) {
    return (
      <main className="p-6">
        <div className="rounded-2xl border border-[#ECECF4] bg-white p-8 text-center">
          <h2 className="font-semibold text-[#202033]">
            Analysis data unavailable
          </h2>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-6 p-6">

      {/* HEADER */}

      <section className="rounded-2xl border border-[#ECECF4] bg-white p-6">

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-sm text-[#777791]">
              Analysis Overview
            </p>

            <h1 className="mt-1 text-2xl font-semibold text-[#202033]">
              {analysis.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#777791]">

              <span>
                {formatDate(
                  analysis.createdAt,
                )}
              </span>

              <span className="h-1 w-1 rounded-full bg-[#B8B8C8]" />

              <span className="capitalize">
                {analysis.status.toLowerCase()}
              </span>

              <span className="h-1 w-1 rounded-full bg-[#B8B8C8]" />

              <span>
                {analysis.sourceType}
              </span>

            </div>

          </div>

          <ScoreDisplay
            score={report.scores.overall}
          />

        </div>

      </section>


      {/* SCORE BREAKDOWN */}

      <section className="rounded-2xl border border-[#ECECF4] bg-white p-6">

        <div>
          <h2 className="text-lg font-semibold text-[#202033]">
            Score Breakdown
          </h2>

          <p className="mt-1 text-sm text-[#777791]">
            How this repository performed across
            the major analysis categories.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <ScoreCard
            label="Architecture"
            score={
              report.scores.architecture
            }
          />

          <ScoreCard
            label="Code Quality"
            score={
              report.scores.codeQuality
            }
          />

          <ScoreCard
            label="Technologies"
            score={
              report.scores.technologies
            }
          />

          <ScoreCard
            label="Security"
            score={
              report.scores.security
            }
          />

        </div>

      </section>


      {/* REPOSITORY METRICS */}

      {metrics && (
        <section>

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#202033]">
              Repository Snapshot
            </h2>

            <p className="mt-1 text-sm text-[#777791]">
              A quick look at the structure and
              size of the analyzed codebase.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <MetricCard
              label="Total Lines"
              value={metrics.totalLines}
            />

            <MetricCard
              label="Code Lines"
              value={metrics.codeLines}
            />

            <MetricCard
              label="Functions"
              value={metrics.functions}
            />

            <MetricCard
              label="Imports"
              value={metrics.imports}
            />

            <MetricCard
              label="Exports"
              value={metrics.exports}
            />

            <MetricCard
              label="Classes"
              value={metrics.classes}
            />

            <MetricCard
              label="Interfaces"
              value={metrics.interfaces}
            />

            <MetricCard
              label="Comments"
              value={metrics.commentLines}
            />

          </div>

        </section>
      )}


      {/* AI SUMMARY */}

      <section className="rounded-2xl border border-[#ECECF4] bg-white p-6">

        <h2 className="text-lg font-semibold text-[#202033]">
          AI Analysis Summary
        </h2>

        <p className="mt-4 max-w-5xl text-sm leading-7 text-[#55556A]">
          {report.summary}
        </p>

      </section>


      {/* ARCHITECTURE */}

      <section className="rounded-2xl border border-[#ECECF4] bg-white p-6">

        <h2 className="text-lg font-semibold text-[#202033]">
          Architecture
        </h2>

        <p className="mt-1 text-sm text-[#777791]">
          {report.architecture.overview}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

          <InsightList
            title="Patterns"
            items={
              report.architecture.patterns
            }
          />

          <InsightList
            title="Concerns"
            items={
              report.architecture.concerns
            }
          />

        </div>

      </section>


      {/* CODE QUALITY */}

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        <InsightList
          title="Code Quality Strengths"
          items={
            report.codeQuality.strengths
          }
        />

        <InsightList
          title="Code Quality Weaknesses"
          items={
            report.codeQuality.weaknesses
          }
        />

      </section>


      {/* SECURITY */}

      <section className="rounded-2xl border border-[#ECECF4] bg-white p-6">

        <h2 className="text-lg font-semibold text-[#202033]">
          Security
        </h2>

        <div className="mt-5 space-y-6">

          <InsightList
            title="Findings"
            items={
              report.security.findings
            }
          />

          <InsightList
            title="Recommendations"
            items={
              report.security.recommendations
            }
          />

        </div>

      </section>

      <section className="rounded-2xl border border-[#ECECF4] bg-white p-6">

        <h2 className="text-lg font-semibold text-[#202033]">
          Technologies
        </h2>

        <div className="mt-5 space-y-6">

          <InsightList
            title="Findings"
            items={
              report.technologies.strengths
            }
          />

          <InsightList
            title="Recommendations"
            items={
              report.technologies.concerns
            }
          />

        </div>

      </section>


      {/* RISKS */}

      {report.risks.length > 0 && (
        <InsightList
          title="Detected Risks"
          items={report.risks}
        />
      )}

    </main>
  );
}


/* ----------------------------- */
/* COMPONENTS */
/* ----------------------------- */

function ScoreDisplay({
  score,
}: {
  score: number;
}) {
  return (
    <div className="text-center">

      <p className="text-xs font-medium uppercase tracking-wide text-[#9999AA]">
        Overall Score
      </p>

      <p className="mt-1 text-5xl font-bold text-[#7C3AED]">
        {score.toFixed(1)}
      </p>

      <span className="mt-2 inline-block rounded-full bg-[#F3EFFF] px-3 py-1 text-xs font-medium text-[#7C3AED]">
        {getScoreLabel(score)}
      </span>

    </div>
  );
}


function ScoreCard({
  label,
  score,
}: {
  label: string;
  score: number;
}) {
  return (
    <div className="rounded-xl bg-[#F8F7FC] p-5">

      <div className="flex items-center justify-between">

        <p className="text-sm text-[#55556A]">
          {label}
        </p>

        <p className="text-xl font-bold text-[#202033]">
          {score}
        </p>

      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E9E7F2]">

        <div
          className="h-full rounded-full bg-[#7C3AED]"
          style={{
            width: `${Math.min(
              Math.max(score, 0),
              100,
            )}%`,
          }}
        />

      </div>

      <p className="mt-2 text-xs text-[#9999AA]">
        {getScoreLabel(score)}
      </p>

    </div>
  );
}


function MetricCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-[#ECECF4] bg-white p-5">

      <p className="text-sm text-[#777791]">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold text-[#202033]">
        {value.toLocaleString()}
      </p>

    </div>
  );
}


function InsightList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-[#ECECF4] bg-white p-6">

      <h3 className="font-semibold text-[#202033]">
        {title}
      </h3>

      <div className="mt-4 space-y-3">

        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex gap-3"
          >

            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7C3AED]" />

            <p className="text-sm leading-6 text-[#55556A]">
              {item}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}


function getScoreLabel(
  score: number,
) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";

  return "Needs Work";
}


function formatDate(
  date: string,
) {
  return new Date(date).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );
}


function OverviewSkeleton() {
  return (
    <main className="space-y-6 p-6 animate-pulse">

      <div className="h-36 rounded-2xl bg-[#ECECF4]" />

      <div className="h-48 rounded-2xl bg-[#ECECF4]" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {Array.from({ length: 8 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-28 rounded-2xl bg-[#ECECF4]"
            />
          ),
        )}

      </div>

      <div className="h-40 rounded-2xl bg-[#ECECF4]" />

      <div className="h-60 rounded-2xl bg-[#ECECF4]" />

    </main>
  );
}