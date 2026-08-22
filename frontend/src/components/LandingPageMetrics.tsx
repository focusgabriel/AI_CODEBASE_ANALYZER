import {
  BarChart3,
  Box,
  Braces,
  Code2,
  FileCode2,
  GitBranch,
  Import,
  Layers3,
  Network,
  Package,
  Share2,
  Type,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface RepositoryMetricsData {
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

interface RepositoryMetricsProps {
  repositoryName?: string;
  metrics: RepositoryMetricsData;
  onAnalysisChange?: (analysisId: string) => void;
  analyses?: {
    id: string;
    name: string;
  }[];
  selectedAnalysisId?: string;
}

interface MetricCardProps {
  label: string;
  value: number;
  description: string;
  icon: LucideIcon;
  accent:
    | "indigo"
    | "blue"
    | "orange"
    | "slate"
    | "green"
    | "red"
    | "purple"
    | "cyan"
    | "pink";
}

const accentStyles = {
  indigo: {
    border: "border-t-indigo-400",
    icon: "bg-indigo-50 text-indigo-600",
  },
  blue: {
    border: "border-t-sky-400",
    icon: "bg-sky-50 text-sky-600",
  },
  orange: {
    border: "border-t-orange-400",
    icon: "bg-orange-50 text-orange-600",
  },
  slate: {
    border: "border-t-slate-300",
    icon: "bg-slate-100 text-slate-600",
  },
  green: {
    border: "border-t-emerald-400",
    icon: "bg-emerald-50 text-emerald-600",
  },
  red: {
    border: "border-t-rose-400",
    icon: "bg-rose-50 text-rose-600",
  },
  purple: {
    border: "border-t-violet-400",
    icon: "bg-violet-50 text-violet-600",
  },
  cyan: {
    border: "border-t-cyan-400",
    icon: "bg-cyan-50 text-cyan-600",
  },
  pink: {
    border: "border-t-fuchsia-400",
    icon: "bg-fuchsia-50 text-fuchsia-600",
  },
};

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  accent,
}: MetricCardProps) {
  const styles = accentStyles[accent];

  return (
    <div
      className={`
        overflow-hidden
        rounded-xl
        border
        border-slate-200
        border-t-2
        bg-white
        ${styles.border}
      `}
    >
      <div className="flex min-h-[116px] items-center gap-4 px-5 py-4">

        <div
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            ${styles.icon}
          `}
        >
          <Icon size={19} strokeWidth={1.8} />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-1 truncate text-xs text-slate-400">
            {description}
          </p>
        </div>

      </div>
    </div>
  );
}

function SectionHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="shrink-0 text-sm font-semibold uppercase tracking-wide text-slate-600">
        {children}
      </h2>

      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

function CodeComposition({
  metrics,
}: {
  metrics: RepositoryMetricsData;
}) {
  const total = Math.max(metrics.totalLines, 1);

  const codePercentage = (metrics.codeLines / total) * 100;
  const commentPercentage = (metrics.commentLines / total) * 100;
  const blankPercentage = (metrics.blankLines / total) * 100;

  return (
    <div className="rounded-xl border border-slate-200 bg-white">

      {/* Header */}

      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <BarChart3 size={17} />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Code Composition
          </h3>

          <p className="mt-0.5 text-xs text-slate-400">
            How the repository's total lines are distributed.
          </p>
        </div>

      </div>


      {/* Composition bar */}

      <div className="px-6 py-6">

        <div className="flex h-3 overflow-hidden rounded-full bg-slate-100">

          <div
            className="bg-indigo-500"
            style={{
              width: `${codePercentage}%`,
            }}
          />

          <div
            className="bg-orange-400"
            style={{
              width: `${commentPercentage}%`,
            }}
          />

          <div
            className="bg-slate-300"
            style={{
              width: `${blankPercentage}%`,
            }}
          />

        </div>


        {/* Legend */}

        <div className="mt-5 flex flex-wrap gap-x-7 gap-y-3">

          <LegendItem
            color="bg-indigo-500"
            label="Code"
            value={`${codePercentage.toFixed(1)}%`}
          />

          <LegendItem
            color="bg-orange-400"
            label="Comments"
            value={`${commentPercentage.toFixed(1)}%`}
          />

          <LegendItem
            color="bg-slate-300"
            label="Blank"
            value={`${blankPercentage.toFixed(1)}%`}
          />

        </div>

      </div>

    </div>
  );
}

function LegendItem({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">

      <span
        className={`h-2.5 w-2.5 rounded-full ${color}`}
      />

      <span className="text-slate-500">
        {label}
      </span>

      <span className="font-medium text-slate-700">
        {value}
      </span>

    </div>
  );
}

function CodeStructure({
  metrics,
}: {
  metrics: RepositoryMetricsData;
}) {
  const items = [
    {
      label: "Functions",
      value: metrics.functions,
      color: "bg-violet-500",
    },
    {
      label: "Imports",
      value: metrics.imports,
      color: "bg-emerald-500",
    },
    {
      label: "Exports",
      value: metrics.exports,
      color: "bg-rose-400",
    },
    {
      label: "Classes",
      value: metrics.classes,
      color: "bg-cyan-400",
    },
    {
      label: "Interfaces",
      value: metrics.interfaces,
      color: "bg-fuchsia-400",
    },
  ];

  const maxValue = Math.max(
    ...items.map((item) => item.value),
    1,
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white">

      {/* Header */}

      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
          <Network size={17} />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Code Structure
          </h3>

          <p className="mt-0.5 text-xs text-slate-400">
            Structural elements detected in this analysis.
          </p>
        </div>

      </div>


      {/* Chart */}

      <div className="px-6 py-6">

        <div className="flex h-44 items-end gap-5 border-b border-l border-slate-100 px-5 pb-0">

          {items.map((item) => {
            const height =
              item.value === 0
                ? 3
                : Math.max(
                    (item.value / maxValue) * 100,
                    8,
                  );

            return (
              <div
                key={item.label}
                className="flex h-full flex-1 flex-col items-center justify-end"
              >

                <span className="mb-2 text-xs font-medium text-slate-600">
                  {item.value}
                </span>

                <div
                  className={`
                    w-full
                    max-w-12
                    rounded-t-md
                    ${item.color}
                  `}
                  style={{
                    height: `${height}%`,
                  }}
                />

              </div>
            );
          })}

        </div>


        <div className="ml-5 mt-3 flex gap-5">

          {items.map((item) => (
            <div
              key={item.label}
              className="flex flex-1 justify-center text-[10px] text-slate-400"
            >
              {item.label}
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default function RepositoryMetrics({
  repositoryName = "Inventory",
  metrics,
  analyses = [],
  selectedAnalysisId,
  onAnalysisChange,
}: RepositoryMetricsProps) {
  return (
    <section className="min-h-screen bg-[#f8fafc] text-slate-900">

      <div className="mx-auto max-w-[1500px] px-6 py-9 lg:px-8">

        {/* ============================================
            PAGE HEADER
        ============================================ */}

        <div className="border-b border-slate-200 pb-8">

          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-start">

            <div>

              <div className="flex items-center gap-2">

                <span className="h-px w-7 bg-indigo-400" />

                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-500">
                  Repository Metrics
                </span>

              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                Codebase Intelligence
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Structural metrics of the analyzed codebase —
                line counts, composition, and detected elements.
              </p>

            </div>


            {/* Analysis selector */}

            <div className="w-full lg:w-[430px]">

              <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Select analysis
              </label>

              {analyses.length > 0 ? (
                <select
                  value={selectedAnalysisId ?? ""}
                  onChange={(event) =>
                    onAnalysisChange?.(
                      event.target.value,
                    )
                  }
                  className="
                    h-11
                    w-full
                    appearance-none
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    px-4
                    text-sm
                    font-medium
                    text-slate-800
                    outline-none
                    transition
                    focus:border-indigo-400
                    focus:ring-2
                    focus:ring-indigo-100
                  "
                >
                  {analyses.map((analysis) => (
                    <option
                      key={analysis.id}
                      value={analysis.id}
                    >
                      {analysis.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex h-11 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800">
                  {repositoryName}
                </div>
              )}

            </div>

          </div>

        </div>


        {/* ============================================
            LINE METRICS
        ============================================ */}

        <div className="mt-10">

          <SectionHeading>
            Line Metrics
          </SectionHeading>


          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

            <MetricCard
              label="Total Lines"
              value={metrics.totalLines}
              description="All analyzed lines"
              icon={FileCode2}
              accent="indigo"
            />

            <MetricCard
              label="Code Lines"
              value={metrics.codeLines}
              description="Lines containing code"
              icon={Code2}
              accent="blue"
            />

            <MetricCard
              label="Comment Lines"
              value={metrics.commentLines}
              description="Lines containing comments"
              icon={FileCode2}
              accent="orange"
            />

            <MetricCard
              label="Blank Lines"
              value={metrics.blankLines}
              description="Empty lines"
              icon={Braces}
              accent="slate"
            />

            <MetricCard
              label="Imports"
              value={metrics.imports}
              description="Import declarations"
              icon={Package}
              accent="green"
            />

          </div>

        </div>


        {/* ============================================
            STRUCTURAL ELEMENTS
        ============================================ */}

        <div className="mt-10">

          <SectionHeading>
            Structural Elements
          </SectionHeading>


          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <MetricCard
              label="Exports"
              value={metrics.exports}
              description="Export declarations"
              icon={Share2}
              accent="red"
            />

            <MetricCard
              label="Functions"
              value={metrics.functions}
              description="Functions detected"
              icon={GitBranch}
              accent="purple"
            />

            <MetricCard
              label="Classes"
              value={metrics.classes}
              description="Classes detected"
              icon={Layers3}
              accent="cyan"
            />

            <MetricCard
              label="Interfaces"
              value={metrics.interfaces}
              description="Interfaces detected"
              icon={Type}
              accent="pink"
            />

          </div>

        </div>


        {/* ============================================
            LOWER ANALYSIS PANELS
        ============================================ */}

        <div className="mt-10 grid gap-5 lg:grid-cols-2">

          <CodeComposition
            metrics={metrics}
          />

          <CodeStructure
            metrics={metrics}
          />

        </div>

      </div>

    </section>
  );
}