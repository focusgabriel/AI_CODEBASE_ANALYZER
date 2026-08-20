/** @format */

import { useEffect, useState } from "react";
import { Code2, Summary, TrendingUp } from "lucide-react";
import type { DashboardResponse } from "../types/dashboard";
import api from "../api/fetch";
import UploadOverview from "./UploadOverview";
import HowItWorks from "./HowItWorks";
import AnalysisField from "./AnalysisField";
import OverallCodebaseScore from "./OverallCodebaseScore";
import CodeScores from "./CodeScores";
import ReportField from "./ReportField";
import ScoreTrend from "./ScoreTrend";

/** Counts up from 0 to target when the component mounts. */
const useCountUp = (target: number, duration = 1200) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target <= 0) return; // value stays at initial 0

    let frame: number;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(Math.round(target * eased));

      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
};

const Dashboard = () => {
  const [dashboardData, setDashboard] = useState<DashboardResponse | null>(
    null,
  );
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const response = await api.get("/dashboard");
        const res = await api.get("/analyses");
        setAnalytics(res.data.getAnalysis);
        setDashboard(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    void getDashboard();
  }, []);

  const reports = dashboardData?.reports ?? [];
  const analysisId = analytics.map(item => item._id);
  // const getAnalysisId = analysisId?.map((item) => item)
  const getOneAnalysisId = analysisId?.map((item) => item)
  // console.log(getOneAnalysisId[0])

  const averageOf = (
    key: "codeQuality" | "security" | "architecture" | "technologies",
  ) => {
    if (reports.length === 0) return 0;

    const total = reports.reduce((sum, item) => sum + item.scores[key], 0);

    return total / reports.length;
  };

  const codeQualityOverall = averageOf("codeQuality");
  const securityOverall = averageOf("security");
  const architectureOverall = averageOf("architecture");
  const technologiesOverall = averageOf("technologies");

  const loc =
    dashboardData?.File.size.reduce((value, sum) => value + sum, 0) ?? 0;

  const animatedLoc = useCountUp(loc);

  const formatLOC = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(animatedLoc);

  return (
    <section className="px-2 pb-8 sm:px-4 lg:px-6">
      {/* —— Hero / top section —— */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.15)]">
        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-linear-to-br from-indigo-200/40 to-violet-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-linear-to-tr from-amber-100/50 to-orange-100/30 blur-3xl" />

        {/* Section header */}
        <div className="relative flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Codebase Intelligence
            </h1>
            <p className="mt-1 text-[13px] text-slate-500 sm:text-sm">
              Upload a repository, watch the AI analyze it, and explore the
              insights.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* —— Lines of Code stat chip —— */}
            <div className="group relative overflow-hidden rounded-xl border border-indigo-100 bg-linear-to-r from-indigo-50/80 to-violet-50/50 px-4 py-2.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/60 sm:px-5">
              {/* Sheen sweep on hover */}
              <div className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/70 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

              {/* Top accent bar */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                  <Code2 className="h-4.5 w-4.5" />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Lines of Code
                  </p>
                  <p className="bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-xl font-extrabold tabular-nums leading-6 text-transparent sm:text-2xl">
                    {formatLOC}
                  </p>
                </div>
              </div>
            </div>

            {/* —— Status pill —— */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-emerald-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {reports.length > 0
                ? `${reports.length} ${reports.length === 1 ? "analysis" : "analyses"} ready`
                : "Ready to analyze"}
            </span>
          </div>
        </div>

        {/* Three-panel grid */}
        <div className="relative grid grid-cols-1 items-stretch gap-4 p-4 sm:p-5 lg:grid-cols-12 lg:gap-5">
          {/* Upload — compact widget matching sibling panel heights */}
          <div className="flex lg:col-span-5">
            <UploadOverview />
          </div>

          {/* How it works */}
          <div className="flex lg:col-span-3">
            <HowItWorks />
          </div>

          {/* Recent analysis */}
          <div className="flex lg:col-span-4">
            <AnalysisField
              getAnalysis={dashboardData?.getAnalysis ?? []}
              scoreTrend={
                dashboardData?.scoreTrend ?? {
                  trend: [],
                  highestScore: 0,
                  lowestScore: 0,
                  averageScore: 0,
                }
              }
            />
          </div>
        </div>
      </div>

      {/* —— Score cards —— */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <OverallCodebaseScore
          score={dashboardData?.scoreTrend.averageScore ?? 0}
        />
        <CodeScores
          codeQuality={codeQualityOverall.toFixed(1)}
          security={securityOverall.toFixed(1)}
          maintainability={architectureOverall.toFixed(1)}
          technologies={technologiesOverall.toFixed(1)}
        />
      </div>

      {/* —— Reports + trend —— */}
      <section className="relative mt-6 overflow-hidden rounded-3xl border border-slate-200/80 bg-linear-to-br from-white via-white to-indigo-50/40 p-3 shadow-[0_16px_45px_-32px_rgba(15,23,42,0.28)] sm:p-5">
        <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="relative mb-4 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200">
              <Summary className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                Analysis insights
              </h2>
              <p className="mt-0.5 text-[12px] text-slate-500 sm:text-[13px]">
                Explore key findings alongside your codebase score history.
              </p>
            </div>
          </div>
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-[11px] font-semibold text-indigo-700">
            <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
            Live analysis overview
          </div>
        </div>
        <div className="relative grid grid-cols-1 items-stretch gap-4 lg:grid-cols-5 lg:gap-5">
          <div className="flex min-w-0 lg:col-span-3">
            <ReportField
              reports={dashboardData?.reports ?? []}
              getAnalysis={dashboardData?.getAnalysis ?? []}
            />
          </div>
          <div className="flex min-w-0 lg:col-span-2">
            <ScoreTrend />
          </div>
        </div>
      </section>
    </section>
  );
};

export default Dashboard;
