import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { GitBranch } from "lucide-react";
import type { RepositoryMetrics } from "../types/metrics";

interface CodeStructureChartProps {
  metrics: RepositoryMetrics;
}

export default function CodeStructureChart({ metrics }: CodeStructureChartProps) {
  const data = [
    { name: "Functions", value: metrics.functions },
    { name: "Imports", value: metrics.imports },
    { name: "Exports", value: metrics.exports },
    { name: "Interfaces", value: metrics.interfaces },
    { name: "Classes", value: metrics.classes },
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
          <GitBranch className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Code Structure</h2>
          <p className="text-xs text-slate-400">
            Structural elements detected in this analysis.
          </p>
        </div>
      </div>

      <div className="p-5">
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 20, bottom: 5, left: 10 }}
            >
              <CartesianGrid horizontal={false} stroke="#f1f5f9" strokeDasharray="4 4" />

              <XAxis
                type="number"
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />

              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                width={90}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />

              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) return null;

                  const item = payload[0].payload;

                  return (
                    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                      <p className="text-xs text-slate-500">{item.name}</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">
                        {item.value.toLocaleString()}
                      </p>
                    </div>
                  );
                }}
              />

              <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={26} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3">
          {data.map(item => (
            <div key={item.name} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              <span className="text-xs font-medium text-slate-500">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}