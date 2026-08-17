import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ScoreTrend } from "../types/dashboard";


interface ScoreTrendChartProps {
  scoreTrend: ScoreTrend;
}

export default function ScoreTrendChart({
  scoreTrend,
}: ScoreTrendChartProps) {
  const data = scoreTrend.trend.map((item) => ({
    ...item,
    label: new Date(item.date).toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric",
      },
    ),
  }));

  return (
    <section className="rounded-2xl border border-[#ECECF4] bg-white p-6">

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#202033]">
          Analysis Score Trend
        </h2>

        <p className="mt-1 text-sm text-[#777791]">
          Score progression across your repository analyses.
        </p>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid
              stroke="#ECECF4"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#777791",
                fontSize: 12,
              }}
            />

            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#777791",
                fontSize: 12,
              }}
            />

            <Tooltip
              cursor={{
                stroke: "#D9D5F5",
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
                      {new Date(
                        item.date,
                      ).toLocaleString()}
                    </p>

                    <p className="mt-1 text-lg font-semibold text-[#202033]">
                      {item.score.toFixed(1)}
                    </p>
                  </div>
                );
              }}
            />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#7C3AED"
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "#7C3AED",
              }}
              activeDot={{
                r: 7,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* SUMMARY */}
      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-[#ECECF4] pt-5">

        <div>
          <p className="text-xs text-[#9999AA]">
            Highest
          </p>

          <p className="mt-1 text-lg font-semibold text-[#202033]">
            {scoreTrend.highestScore.toFixed(1)}
          </p>
        </div>

        <div>
          <p className="text-xs text-[#9999AA]">
            Average
          </p>

          <p className="mt-1 text-lg font-semibold text-[#202033]">
            {scoreTrend.averageScore.toFixed(1)}
          </p>
        </div>

        <div>
          <p className="text-xs text-[#9999AA]">
            Lowest
          </p>

          <p className="mt-1 text-lg font-semibold text-[#202033]">
            {scoreTrend.lowestScore.toFixed(1)}
          </p>
        </div>

      </div>

    </section>
  );
}