import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: number | string;
  description?: string;
  icon?: LucideIcon;
  accent?: string;
  iconBg?: string;
}

export default function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  accent = "bg-indigo-500",
  iconBg = "bg-indigo-50 text-indigo-600",
}: MetricCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-sm">
      {/* Subtle top accent */}
      <div
        className={`absolute inset-x-0 top-0 h-0.5 ${accent} opacity-70 transition-opacity duration-200 group-hover:opacity-100`}
      />

      <div className="flex items-center gap-3">
        {Icon && (
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg} transition-transform duration-200 group-hover:scale-105`}
          >
            <Icon className="h-4 w-4" />
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium uppercase tracking-wider text-slate-400">
            {label}
          </p>
          <p className="mt-0.5 text-xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
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