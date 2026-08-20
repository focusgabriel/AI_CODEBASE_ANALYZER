/** @format */

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowBigRightDash,
  BarChart3,
  CheckCircle2,
  CodeXml,
  FileText,
  Inbox,
  Lightbulb,
  ShieldAlert,
  Sparkles,
  ThumbsUp,
  TrendingUp,
  Waypoints,
  X,
} from "lucide-react";
import type { Analysis, Reports } from "../types/dashboard";
import { ReportsCard } from "../components/ReportCard";

interface ReportsData {
  reports: Reports[];
  getAnalysis: Analysis[];
}

type ReportTab =
  | "topIssues"
  | "findings"
  | "recommendations"
  | "goodPractice"
  | "overview"
  | "architecture"
  | "badPractice";

interface TabConfig {
  id: ReportTab;
  label: string;
  icon: LucideIcon;
  accent: string;
}

const TAB_CONFIG: TabConfig[] = [
  { id: "topIssues", label: "Top Issues", icon: AlertTriangle, accent: "from-rose-500 to-red-500" },
  { id: "findings", label: "Findings", icon: ShieldAlert, accent: "from-amber-500 to-orange-500" },
  { id: "recommendations", label: "Recommendations", icon: Lightbulb, accent: "from-sky-500 to-blue-500" },
  { id: "goodPractice", label: "Good Practice", icon: ThumbsUp, accent: "from-emerald-500 to-green-500" },
  { id: "overview", label: "Overview", icon: Inbox, accent: "from-violet-500 to-purple-500" },
  { id: "architecture", label: "Architecture", icon: Waypoints, accent: "from-orange-500 to-amber-500" },
  { id: "badPractice", label: "Bad Practice", icon: X, accent: "from-pink-500 to-rose-500" },
];

function plural(count: number, word: string): string {
  return count === 1 ? word : `${word}s`;
}

type CardTone = "indigo" | "red" | "amber" | "blue" | "green" | "violet" | "orange" | "pink";

function getCardData(
  item: Reports,
  tab: ReportTab,
): { content: string; badge: string; tone: CardTone } {
  switch (tab) {
    case "topIssues":
      return {
        content: item.risks.join(" • "),
        badge: `${item.risks?.length} ${plural(item.risks?.length, "risk")}`,
        tone: "red",
      };
    case "findings":
      return {
        content: item.security.findings.join(" • "),
        badge: `${item.security.findings?.length} ${plural(
          item.security.findings?.length,
          "finding",
        )}`,
        tone: "amber",
      };
    case "recommendations":
      return {
        content: item.security.recommendations.join(" • "),
        badge: `${item.security.recommendations?.length} ${plural(
          item.security.recommendations?.length,
          "recommendation",
        )}`,
        tone: "blue",
      };
    case "goodPractice":
      return {
        content: item.codeQuality.strengths.join(" • "),
        badge: `${item.codeQuality.strengths?.length} ${plural(
          item.codeQuality.strengths?.length,
          "strength",
        )}`,
        tone: "green",
      };
    case "architecture":
      return {
        content: item.architecture.patterns.join(" • "),
        badge: `${item.architecture.patterns?.length} ${plural(
          Number(item.architecture.patterns?.length),
          "patterns",
        )}`,
        tone: "orange",
      };
    case "badPractice":
      return {
        content: item.codeQuality.weaknesses?.join(" • "),
        badge: `${item.codeQuality.weaknesses?.length} ${plural(
          item.codeQuality.weaknesses?.length,
          "bad practices",
        )}`,
        tone: "pink",
      };
    case "overview":
    default:
      return {
        content: item.summary,
        badge: "Summary",
        tone: "violet",
      };
  }
}

const ReportPage = ({ reports, getAnalysis }: ReportsData) => {
  const reportList: Reports[] = Array.isArray(reports) ? reports : [];

  const [activeTab, setActiveTab] = useState<ReportTab>("topIssues");
  const [showAll, setShowAll] = useState(false);

  const getName = new Map<string, string>(
    (getAnalysis ?? []).map(item => [item._id, item.name]),
  );

  const tabCounts: Record<ReportTab, number> = {
    topIssues: reportList.reduce((sum, item) => sum + item.risks?.length, 0),
    findings: reportList.reduce(
      (sum, item) => sum + item.security.findings?.length,
      0,
    ),
    recommendations: reportList.reduce(
      (sum, item) => sum + item.security.recommendations?.length,
      0,
    ),
    goodPractice: reportList.reduce(
      (sum, item) => sum + item.codeQuality.strengths?.length,
      0,
    ),
    badPractice: reportList.reduce(
      (sum, item) => sum + item.codeQuality.weaknesses?.length,
      0,
    ),
    architecture: reportList.reduce(
      (sum, item) => sum + item.architecture.patterns?.length,
      0,
    ),
    overview: reportList.length,
  };

  const hasReports = reportList.length > 0;
  const visibleReports = showAll ? reportList : reportList.slice(0, 5);

  // Aggregate stats for the hero / stat cards
  const stats = useMemo(() => {
    const totalIssues = reportList.reduce(
      (sum, item) => sum + (item.risks?.length ?? 0),
      0,
    );
    const totalFindings = reportList.reduce(
      (sum, item) => sum + (item.security.findings?.length ?? 0),
      0,
    );
    const totalRecommendations = reportList.reduce(
      (sum, item) => sum + (item.security.recommendations?.length ?? 0),
      0,
    );
    const totalStrengths = reportList.reduce(
      (sum, item) => sum + (item.codeQuality.strengths?.length ?? 0),
      0,
    );
    const avgScore = reportList.length
      ? Math.round(
          reportList.reduce((sum, item) => sum + (item.scores?.overall ?? 0), 0) /
            reportList.length,
        )
      : 0;

    return {
      totalIssues,
      totalFindings,
      totalRecommendations,
      totalStrengths,
      avgScore,
      totalReports: reportList.length,
    };
  }, [reportList]);

  const activeTabConfig = TAB_CONFIG.find(t => t.id === activeTab) ?? TAB_CONFIG[0];

  // Score color based on value
  const scoreColor =
    stats.avgScore >= 80
      ? "from-emerald-500 to-teal-500"
      : stats.avgScore >= 60
        ? "from-indigo-500 to-violet-500"
        : stats.avgScore >= 40
          ? "from-amber-500 to-orange-500"
          : "from-rose-500 to-red-500";

  const scoreTextColor =
    stats.avgScore >= 80
      ? "text-emerald-600"
      : stats.avgScore >= 60
        ? "text-indigo-600"
        : stats.avgScore >= 40
          ? "text-amber-600"
          : "text-rose-600";

  const scoreLabel =
    stats.avgScore >= 80
      ? "Excellent"
      : stats.avgScore >= 60
        ? "Good"
        : stats.avgScore >= 40
          ? "Needs Work"
          : "Critical";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Document Header ─────────────────────────────────────── */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-indigo-500">
              <span className="h-px w-6 bg-indigo-300" />
              Code Analysis Reports
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Codebase Health Report
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
              A comprehensive breakdown of your project's security, code quality,
              architecture, and best practices — all in one place.
            </p>
          </div>

          {/* ── Outstanding Avg Score Section ─────────────────────── */}
          <div className="w-full max-w-sm shrink-0">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              {/* Top accent bar */}
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${scoreColor}`} />

              {/* Decorative soft glow */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-100/40 blur-2xl" />

              <div className="relative flex items-center gap-5">
                {/* Score ring */}
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                  <svg className="h-24 w-24 -rotate-90" viewBox="0 0 96 96">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="7"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke="url(#avgScoreGradient)"
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeDasharray={`${(stats.avgScore / 100) * 251.2} 251.2`}
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="avgScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className={`text-3xl font-bold tabular-nums ${scoreTextColor}`}>
                      {stats.avgScore}
                    </span>
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                      / 100
                    </span>
                  </div>
                </div>

                {/* Score details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${scoreColor} px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white`}>
                      <CodeXml  className="h-3 w-3" />
                      {scoreLabel}
                    </span>
                  </div>
                  <p className="mt-2 text-[13px] font-semibold text-slate-800">
                    Average Score
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Across {stats.totalReports} {plural(stats.totalReports, "project")}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="font-medium">{stats.totalFindings} total findings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards Row ─────────────────────────────────────── */}
      <div className="mt-8 mb-4 flex items-center gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
          Report Summary
        </h2>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[
          {
            label: "Total Reports",
            value: stats.totalReports,
            icon: FileText,
            accent: "bg-indigo-500",
            iconBg: "bg-indigo-50 text-indigo-600",
          },
          {
            label: "Top Issues",
            value: stats.totalIssues,
            icon: AlertTriangle,
            accent: "bg-rose-500",
            iconBg: "bg-rose-50 text-rose-600",
          },
          {
            label: "Findings",
            value: stats.totalFindings,
            icon: ShieldAlert,
            accent: "bg-amber-500",
            iconBg: "bg-amber-50 text-amber-600",
          },
          {
            label: "Recommendations",
            value: stats.totalRecommendations,
            icon: Lightbulb,
            accent: "bg-sky-500",
            iconBg: "bg-sky-50 text-sky-600",
          },
          {
            label: "Strengths",
            value: stats.totalStrengths,
            icon: CheckCircle2,
            accent: "bg-emerald-500",
            iconBg: "bg-emerald-50 text-emerald-600",
          },
        ].map(({ label, value, icon: Icon, accent, iconBg }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
          >
            <div
              className={`absolute inset-x-0 top-0 h-0.5 ${accent} opacity-70 transition-opacity duration-200 group-hover:opacity-100`}
            />
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg} transition-transform duration-200 group-hover:scale-105`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  {label}
                </p>
                <p className="mt-0.5 text-xl font-semibold tracking-tight text-slate-900">
                  {value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Content ───────────────────────────────────────── */}
      <div className="mt-8 grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Left: Tabs + Report list */}
        <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 bg-slate-50/50 p-3">
            {TAB_CONFIG.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  aria-pressed={isActive}
                  title={label}
                  className={[
                    "relative inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-400/60",
                    isActive
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                      : "bg-transparent text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm active:scale-[0.97]",
                  ].join(" ")}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? "text-indigo-300" : "text-slate-400"
                    }`}
                  />
                  <span className="truncate">{label}</span>
                  <span
                    className={[
                      "rounded-full px-1.5 py-0.5 text-[11px] font-bold tabular-nums",
                      isActive
                        ? "bg-white/15 text-white"
                        : "bg-slate-100 text-slate-500",
                    ].join(" ")}
                  >
                    {tabCounts[id]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Report cards */}
          <div className="min-h-[280px]">
            {!hasReports ? (
              <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
                <div className="relative">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-indigo-200/50 blur-xl" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30">
                    <Inbox className="h-8 w-8" />
                  </div>
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-800">
                    No reports yet
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Reports from your code analyses will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <div key={activeTab} className="animate-fade-slide-in divide-y divide-slate-100">
                {visibleReports.map(item => {
                  const { content, badge, tone } = getCardData(item, activeTab);

                  return (
                    <ReportsCard
                      key={item.analysisId}
                      title={getName.get(item.analysisId) ?? "Untitled project"}
                      content={content}
                      issues={badge}
                      tone={tone}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* View all / Show less */}
          {hasReports && (
            <button
              type="button"
              onClick={() => setShowAll(prev => !prev)}
              className="flex w-full cursor-pointer items-center justify-center gap-2 border-t border-slate-100 bg-gradient-to-r from-slate-50 via-indigo-50/50 to-slate-50 px-4 py-3.5 text-[14px] font-semibold text-indigo-700 transition-all duration-200 hover:from-indigo-50 hover:to-violet-50 hover:text-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 active:bg-indigo-100"
            >
              {showAll ? "Show Less" : "View All"} ({reportList.length}{" "}
              {plural(reportList.length, "report")})
              <ArrowBigRightDash
                className={`h-4 w-4 transition-transform duration-300 ${
                  showAll ? "-rotate-90" : "rotate-90"
                }`}
              />
            </button>
          )}
        </div>

        {/* Right: Sidebar */}
        <div className="flex w-full min-w-0 flex-col gap-4 lg:w-auto">
          {/* Active tab summary */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div
              className={`bg-gradient-to-r ${activeTabConfig.accent} px-5 py-4`}
            >
              <div className="flex items-center gap-2.5">
                <activeTabConfig.icon className="h-5 w-5 text-white" />
                <h3 className="text-sm font-bold text-white">
                  {activeTabConfig.label}
                </h3>
              </div>
            </div>
            <div className="p-5">
              <p className="text-3xl font-bold text-slate-900">
                {tabCounts[activeTab]}
              </p>
              <p className="mt-1 text-[13px] text-slate-500">
                {plural(tabCounts[activeTab], "item")} found across{" "}
                {reportList.length} {plural(reportList.length, "project")}
              </p>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${activeTabConfig.accent} transition-all duration-500`}
                  style={{
                    width: `${Math.min(
                      100,
                      (tabCounts[activeTab] / Math.max(1, Math.max(...Object.values(tabCounts)))) * 100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Quick insights */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-800">Quick Insights</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-500">
                  <AlertTriangle className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-slate-700">
                    {stats.totalIssues} top issues
                  </p>
                  <p className="text-xs text-slate-400">
                    Critical risks detected across your projects
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-500">
                  <Lightbulb className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-slate-700">
                    {stats.totalRecommendations} recommendations
                  </p>
                  <p className="text-xs text-slate-400">
                    Actionable improvements to implement
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-slate-700">
                    {stats.totalStrengths} strengths
                  </p>
                  <p className="text-xs text-slate-400">
                    Things your codebase does well
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;