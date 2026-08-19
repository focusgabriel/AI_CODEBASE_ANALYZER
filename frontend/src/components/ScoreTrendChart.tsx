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
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
          <TrendingUp className="h-4.5 w-4.5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">Analysis Score Trend</h2>
          <p className="text-xs text-slate-400">
            Score progression across your repository analyses.
          </p>
        </div>
      </div>

      <div className="p-6">
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
                cursor={{ stroke: "#c7d2fe" }}
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) return null;

                  const item = payload[0].payload;

                  return (
                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
                      <p className="text-xs text-slate-500">
                        {new Date(item.date).toLocaleString()}
                      </p>
                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {item.score.toFixed(1)}
                      </p>
                    </div>
                  );
                }}
              />

              <Line
                type="monotone"
                dataKey="score"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ r: 5, fill: "#8b5cf6", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-3 gap-4 border-t border-slate-100 pt-5">
          <div className="rounded-xl bg-emerald-50/50 p-3 text-center">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Highest
            </p>
            <p className="mt-1 text-lg font-bold text-emerald-600">
              {scoreTrend.highestScore.toFixed(1)}
            </p>
          </div>
          <div className="rounded-xl bg-indigo-50/50 p-3 text-center">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Average
            </p>
            <p className="mt-1 text-lg font-bold text-indigo-600">
              {scoreTrend.averageScore.toFixed(1)}
            </p>
          </div>
          <div className="rounded-xl bg-rose-50/50 p-3 text-center">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Lowest
            </p>
            <p className="mt-1 text-lg font-bold text-rose-600">
              {scoreTrend.lowestScore.toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}