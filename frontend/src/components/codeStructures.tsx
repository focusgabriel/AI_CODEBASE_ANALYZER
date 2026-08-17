import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { RepositoryMetrics } from "../types/metrics";


interface CodeStructureChartProps {
  metrics: RepositoryMetrics;
}

export default function CodeStructureChart({
  metrics,
}: CodeStructureChartProps) {
  const data = [
    {
      name: "Functions",
      value: metrics.functions,
    },
    {
      name: "Imports",
      value: metrics.imports,
    },
    {
      name: "Exports",
      value: metrics.exports,
    },
    {
      name: "Interfaces",
      value: metrics.interfaces,
    },
    {
      name: "Classes",
      value: metrics.classes,
    },
  ];

  return (
    <section className="rounded-2xl border border-[#ECECF4] bg-white p-6">

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#202033]">
          Code Structure
        </h2>

        <p className="mt-1 text-sm text-[#777791]">
          Structural elements detected in this analysis.
        </p>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 5,
              right: 20,
              bottom: 5,
              left: 10,
            }}
          >
            <CartesianGrid
              horizontal={false}
              stroke="#ECECF4"
              strokeDasharray="4 4"
            />

            <XAxis
              type="number"
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#777791",
                fontSize: 12,
              }}
            />

            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              width={90}
              tick={{
                fill: "#55556A",
                fontSize: 12,
              }}
            />

            <Tooltip
              cursor={{
                fill: "#F8F7FC",
              }}
              content={({ active, payload }) => {
                if (
                  !active ||
                  !payload ||
                  payload.length === 0
                ) {
                  return null;
                }

                const item = payload[0].payload;

                return (
                  <div className="rounded-xl border border-[#ECECF4] bg-white px-4 py-3 shadow-lg">
                    <p className="text-xs text-[#777791]">
                      {item.name}
                    </p>

                    <p className="mt-1 text-lg font-semibold text-[#202033]">
                      {item.value.toLocaleString()}
                    </p>
                  </div>
                );
              }}
            />

            <Bar
              dataKey="value"
              fill="#7C3AED"
              radius={[0, 7, 7, 0]}
              barSize={26}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </section>
  );
}