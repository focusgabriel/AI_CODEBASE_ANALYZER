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
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/20">
          <BarChart3 className="h-4.5 w-4.5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">Code Composition</h2>
          <p className="text-xs text-slate-400">
            How the repository's total lines are distributed.
          </p>
        </div>
      </div>

      <div className="p-6">
        {/* Composition bar */}
        <div className="flex h-4 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
            style={{ width: `${codePercentage}%` }}
          />
          <div
            className="bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
            style={{ width: `${commentPercentage}%` }}
          />
          <div
            className="bg-slate-300 transition-all duration-500"
            style={{ width: `${blankPercentage}%` }}
          />
        </div>

        {/* Details */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CompositionItem
            label="Code"
            value={metrics.codeLines}
            percentage={codePercentage}
            icon={Code2}
            iconClass="bg-indigo-50 text-indigo-600"
            barClass="bg-gradient-to-r from-indigo-500 to-violet-500"
          />
          <CompositionItem
            label="Comments"
            value={metrics.commentLines}
            percentage={commentPercentage}
            icon={FileCode2}
            iconClass="bg-amber-50 text-amber-600"
            barClass="bg-gradient-to-r from-amber-400 to-orange-500"
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
        <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-slate-500">Total lines</span>
          <span className="text-sm font-bold text-slate-900">
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
    <div className="rounded-xl border border-slate-100 p-4 transition-all duration-200 hover:border-slate-200 hover:shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
        >
          <Icon className="h-4.5 w-4.5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-700">{label}</p>
          <p className="text-lg font-bold text-slate-900">
            {value.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
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