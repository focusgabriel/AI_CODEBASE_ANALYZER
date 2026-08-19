/** @format */

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowBigRightDash,
  BarChart3,
  CheckCircle2,
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

type CardTone = "red" | "amber" | "blue" | "green" | "violet" | "orange" | "pink";

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

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* ── Hero Header ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-6 py-8 sm:px-10 sm:py-10">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="pointer-events-none absolute right-1/3 top-0 h-40 w-40 rounded-full bg-sky-500/10 blur-2xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-300 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Code Analysis Reports
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Your Codebase{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-sky-400 bg-clip-text text-transparent">
                Health Report
              </span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-[15px]">
              A comprehensive breakdown of your project's security, code quality,
              architecture, and best practices — all in one place.
            </p>
          </div>

          {/* Overall score ring */}
          <div className="flex shrink-0 items-center gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="6"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${(stats.avgScore / 100) * 213.6} 213.6`}
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold text-white">{stats.avgScore}</span>
                <span className="text-[9px] font-medium uppercase tracking-wider text-slate-400">
                  Avg Score
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                {stats.totalReports} {plural(stats.totalReports, "Project")}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <FileText className="h-4 w-4 text-indigo-400" />
                {stats.totalFindings} total findings
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards Row ─────────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[
          {
            label: "Total Reports",
            value: stats.totalReports,
            icon: FileText,
            gradient: "from-indigo-500 to-violet-500",
            shadow: "shadow-indigo-500/20",
          },
          {
            label: "Top Issues",
            value: stats.totalIssues,
            icon: AlertTriangle,
            gradient: "from-rose-500 to-red-500",
            shadow: "shadow-rose-500/20",
          },
          {
            label: "Findings",
            value: stats.totalFindings,
            icon: ShieldAlert,
            gradient: "from-amber-500 to-orange-500",
            shadow: "shadow-amber-500/20",
          },
          {
            label: "Recommendations",
            value: stats.totalRecommendations,
            icon: Lightbulb,
            gradient: "from-sky-500 to-blue-500",
            shadow: "shadow-sky-500/20",
          },
          {
            label: "Strengths",
            value: stats.totalStrengths,
            icon: CheckCircle2,
            gradient: "from-emerald-500 to-green-500",
            shadow: "shadow-emerald-500/20",
          },
        ].map(({ label, value, icon: Icon, gradient, shadow }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div
              className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${gradient} opacity-60 transition-opacity duration-300 group-hover:opacity-100`}
            />
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg ${shadow} transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  {label}
                </p>
                <p className="text-xl font-bold text-slate-900">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Content ───────────────────────────────────────── */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left: Tabs + Report list */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 bg-slate-50/50 p-3">
            {TAB_CONFIG.map(({ id, label, icon: Icon, accent }) => {
              const isActive = activeTab === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  aria-pressed={isActive}
                  title={label}
                  className={[
                    "relative inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-semibold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-400/60",
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
        <div className="flex flex-col gap-4">
          {/* Active tab summary */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
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
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
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