import type { RepositoryMetrics } from "../types/metrics";

interface CodeCompositionProps {
  metrics: RepositoryMetrics;
}

export default function CodeComposition({
  metrics,
}: CodeCompositionProps) {
  const total = metrics.totalLines || 1;

  const codePercentage =
    (metrics.codeLines / total) * 100;

  const commentPercentage =
    (metrics.commentLines / total) * 100;

  const blankPercentage =
    (metrics.blankLines / total) * 100;

  return (
    <section className="rounded-2xl border border-[#ECECF4] bg-white p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#202033]">
          Code Composition
        </h2>

        <p className="mt-1 text-sm text-[#777791]">
          How the repository's total lines are distributed.
        </p>
      </div>

      {/* COMPOSITION BAR */}
      <div className="overflow-hidden rounded-full bg-[#F1F1F6]">
        <div className="flex h-4 w-full">

          <div
            className="bg-[#7C3AED]"
            style={{
              width: `${codePercentage}%`,
            }}
          />

          <div
            className="bg-[#F59E0B]"
            style={{
              width: `${commentPercentage}%`,
            }}
          />

          <div
            className="bg-[#D8D8E4]"
            style={{
              width: `${blankPercentage}%`,
            }}
          />

        </div>
      </div>

      {/* DETAILS */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

        {/* CODE */}
        <CompositionItem
          label="Code"
          value={metrics.codeLines}
          percentage={codePercentage}
          indicatorClass="bg-[#7C3AED]"
        />

        {/* COMMENTS */}
        <CompositionItem
          label="Comments"
          value={metrics.commentLines}
          percentage={commentPercentage}
          indicatorClass="bg-[#F59E0B]"
        />

        {/* BLANK */}
        <CompositionItem
          label="Blank"
          value={metrics.blankLines}
          percentage={blankPercentage}
          indicatorClass="bg-[#D8D8E4]"
        />

      </div>

      {/* TOTAL */}
      <div className="mt-6 flex items-center justify-between border-t border-[#ECECF4] pt-4">
        <span className="text-sm text-[#777791]">
          Total lines
        </span>

        <span className="text-sm font-semibold text-[#202033]">
          {metrics.totalLines.toLocaleString()}
        </span>
      </div>

    </section>
  );
}

interface CompositionItemProps {
  label: string;
  value: number;
  percentage: number;
  indicatorClass: string;
}

function CompositionItem({
  label,
  value,
  percentage,
  indicatorClass,
}: CompositionItemProps) {
  return (
    <div className="flex items-start gap-3">

      <span
        className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${indicatorClass}`}
      />

      <div>
        <p className="text-sm font-medium text-[#44445A]">
          {label}
        </p>

        <p className="mt-1 text-lg font-semibold text-[#202033]">
          {value.toLocaleString()}
        </p>

        <p className="mt-0.5 text-xs text-[#9999AA]">
          {percentage.toFixed(1)}%
        </p>
      </div>

    </div>
  );
}