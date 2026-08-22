/** @format */

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ScoreTrend as DashboardScoreTrend } from "../types/dashboard";

interface ChartData {
  date: string;
  score: number;
  fullDate: string;
}

export default function ScoreTrend({
  scoreTrend,
}: {
  scoreTrend?: DashboardScoreTrend;
}) {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!scoreTrend) return;

    const formattedData = scoreTrend.trend.map(item => ({
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),

      score: item.score,

      fullDate: new Date(item.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    }));

    setData(formattedData);
    setLoading(false);
  }, [scoreTrend]);

  if (loading) {
    return (
      <div className="flex h-[380px] items-center justify-center w-full">
        <p className="text-sm text-gray-500">Loading score trend...</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex h-[380px] items-center justify-center">
        <p className="text-sm text-gray-500">
          No analysis history available yet.
        </p>
      </div>
    );
  }

  const highestScore = Math.max(...data.map(item => item.score));

  const lowestScore = Math.min(...data.map(item => item.score));

  const averageScore = Math.round(
    data.reduce((total, item) => total + item.score, 0) / data.length,
  );

  return (
    <div className="h-full w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Score Trend</h2>

          <p className="mt-1 text-sm text-gray-500">
            Your codebase score across previous analyses
          </p>
        </div>

        <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 outline-none">
          <option>Last 7 Analyses</option>
          <option>Last 30 Analyses</option>
          <option>All Analyses</option>
        </select>
      </div>

      {/* Chart */}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 10,
            }}
          >
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopOpacity={0.25} />

                <stop offset="100%" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#E5E7EB"
            />

            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#6B7280",
                fontSize: 12,
              }}
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#6B7280",
                fontSize: 12,
              }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) {
                  return null;
                }

                const item = payload[0].payload as ChartData;

                return (
                  <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg">
                    <p className="text-xs text-gray-500">{item.fullDate}</p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      Score: {item.score}
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
                fill: "#FFFFFF",
                stroke: "#7C3AED",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 7,
                fill: "#7C3AED",
                stroke: "#FFFFFF",
                strokeWidth: 3,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-3 border-t border-gray-100 pt-6">
        <div className="text-center">
          <p className="text-sm text-gray-500">Highest Score</p>

          <p className="mt-1 text-2xl font-semibold text-green-500">
            {highestScore}
          </p>
        </div>

        <div className="border-x border-gray-100 text-center">
          <p className="text-sm text-gray-500">Lowest Score</p>

          <p className="mt-1 text-2xl font-semibold text-red-500">
            {lowestScore}
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">Average Score</p>

          <p className="mt-1 text-2xl font-semibold text-violet-600">
            {averageScore}
          </p>
        </div>
      </div>
    </div>
  );
}
