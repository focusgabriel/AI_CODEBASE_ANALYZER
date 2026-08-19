import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import type { ScoreTrend } from "../types/dashboard";

interface ScoreTrendChartProps {
  scoreTrend: ScoreTrend;
}

export default function ScoreTrendChart({ scoreTrend }: ScoreTrendChartProps) {
  const data = scoreTrend.trend.map(item => ({
    ...item,
    label: new Date(item.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <TrendingUp className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Analysis Score Trend
          </h2>
          <p className="text-xs text-slate-400">
            Score progression across your repository analyses.
          </p>
        </div>
      </div>

      <div className="p-5">
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="4 4" vertical={false} />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />

              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />

              <Tooltip
                cursor={{ stroke: "#a7f3d0" }}
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) return null;

                  const item = payload[0].payload;

                  return (
                    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                      <p className="text-xs text-slate-500">
                        {new Date(item.date).toLocaleString()}
                      </p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">
                        {item.score.toFixed(1)}
                      </p>
                    </div>
                  );
                }}
              />

              <Line
                type="monotone"
                dataKey="score"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Summary */}
        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-5">
          <div className="rounded-lg bg-emerald-50/60 p-3 text-center">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Highest
            </p>
            <p className="mt-1 text-lg font-semibold text-emerald-600">
              {scoreTrend.highestScore.toFixed(1)}
            </p>
          </div>
          <div className="rounded-lg bg-indigo-50/60 p-3 text-center">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Average
            </p>
            <p className="mt-1 text-lg font-semibold text-indigo-600">
              {scoreTrend.averageScore.toFixed(1)}
            </p>
          </div>
          <div className="rounded-lg bg-rose-50/60 p-3 text-center">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Lowest
            </p>
            <p className="mt-1 text-lg font-semibold text-rose-600">
              {scoreTrend.lowestScore.toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}