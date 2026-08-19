import { BarChart3, Code2, FileCode2, Minus } from "lucide-react";
import type { RepositoryMetrics } from "../types/metrics";

interface CodeCompositionProps {
  metrics: RepositoryMetrics;
}

export default function CodeComposition({ metrics }: CodeCompositionProps) {
  const total = metrics.totalLines || 1;

  const codePercentage = (metrics.codeLines / total) * 100;
  const commentPercentage = (metrics.commentLines / total) * 100;
  const blankPercentage = (metrics.blankLines / total) * 100;

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <BarChart3 className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Code Composition
          </h2>
          <p className="text-xs text-slate-400">
            How the repository's total lines are distributed.
          </p>
        </div>
      </div>

      <div className="p-5">
        {/* Composition bar */}
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="bg-indigo-500 transition-all duration-500"
            style={{ width: `${codePercentage}%` }}
          />
          <div
            className="bg-amber-400 transition-all duration-500"
            style={{ width: `${commentPercentage}%` }}
          />
          <div
            className="bg-slate-300 transition-all duration-500"
            style={{ width: `${blankPercentage}%` }}
          />
        </div>

        {/* Details */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <CompositionItem
            label="Code"
            value={metrics.codeLines}
            percentage={codePercentage}
            icon={Code2}
            iconClass="bg-indigo-50 text-indigo-600"
            barClass="bg-indigo-500"
          />
          <CompositionItem
            label="Comments"
            value={metrics.commentLines}
            percentage={commentPercentage}
            icon={FileCode2}
            iconClass="bg-amber-50 text-amber-600"
            barClass="bg-amber-400"
          />
          <CompositionItem
            label="Blank"
            value={metrics.blankLines}
            percentage={blankPercentage}
            icon={Minus}
            iconClass="bg-slate-100 text-slate-500"
            barClass="bg-slate-300"
          />
        </div>

        {/* Total */}
        <div className="mt-5 flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-slate-500">Total lines</span>
          <span className="text-sm font-semibold text-slate-900">
            {metrics.totalLines.toLocaleString()}
          </span>
        </div>
      </div>
    </section>
  );
}

interface CompositionItemProps {
  label: string;
  value: number;
  percentage: number;
  icon: typeof Code2;
  iconClass: string;
  barClass: string;
}

function CompositionItem({
  label,
  value,
  percentage,
  icon: Icon,
  iconClass,
  barClass,
}: CompositionItemProps) {
  return (
    <div className="rounded-lg border border-slate-100 p-3">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-700">{label}</p>
          <p className="text-lg font-semibold text-slate-900">
            {value.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${barClass} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs font-medium text-slate-400">
        {percentage.toFixed(1)}% of total
      </p>
    </div>
  );
}