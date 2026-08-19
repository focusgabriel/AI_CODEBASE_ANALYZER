import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: number | string;
  description?: string;
  icon?: LucideIcon;
  gradient?: string;
  shadow?: string;
}

export default function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  gradient = "from-indigo-500 to-violet-500",
  shadow = "shadow-indigo-500/20",
}: MetricCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      {/* Top accent bar */}
      <div
        className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${gradient} opacity-60 transition-opacity duration-300 group-hover:opacity-100`}
      />

      <div className="flex items-center gap-3">
        {Icon && (
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg ${shadow} transition-transform duration-300 group-hover:scale-110`}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium uppercase tracking-wide text-slate-400">
            {label}
          </p>
          <p className="text-xl font-bold text-slate-900">{value}</p>
          {description && (
            <p className="mt-0.5 truncate text-xs text-slate-400">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}