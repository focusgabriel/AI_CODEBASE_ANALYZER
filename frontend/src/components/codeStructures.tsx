import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { GitBranch, Layers, Package, Type, FunctionSquare } from "lucide-react";
import type { RepositoryMetrics } from "../types/metrics";

interface CodeStructureChartProps {
  metrics: RepositoryMetrics;
}

export default function CodeStructureChart({ metrics }: CodeStructureChartProps) {
  const data = [
    { name: "Functions", value: metrics.functions, color: "#8b5cf6" },
    { name: "Imports", value: metrics.imports, color: "#10b981" },
    { name: "Exports", value: metrics.exports, color: "#f43f5e" },
    { name: "Interfaces", value: metrics.interfaces, color: "#d946ef" },
    { name: "Classes", value: metrics.classes, color: "#06b6d4" },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/20">
          <GitBranch className="h-4.5 w-4.5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">Code Structure</h2>
          <p className="text-xs text-slate-400">
            Structural elements detected in this analysis.
          </p>
        </div>
      </div>

      <div className="p-6">
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
                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
                      <p className="text-xs text-slate-500">{item.name}</p>
                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {item.value.toLocaleString()}
                      </p>
                    </div>
                  );
                }}
              />

              <Bar dataKey="value" radius={[0, 7, 7, 0]} barSize={26}>
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3">
          {data.map(item => (
            <div key={item.name} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-medium text-slate-500">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}