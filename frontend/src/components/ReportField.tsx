/** @format */

import { useState } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  Inbox,
  Lightbulb,
  ShieldAlert,
  ThumbsUp,
} from "lucide-react";
import { ReportsCard } from "./ReportCard";
import type { Analysis, Reports } from "../types/dashboard";

interface ReportsData {
  reports: Reports[];
  getAnalysis: Analysis[];
}

type ReportTab =
  | "topIssues"
  | "findings"
  | "recommendations"
  | "goodPractice"
  | "overview";

interface TabConfig {
  id: ReportTab;
  label: string;
  icon: LucideIcon;
}

const TAB_CONFIG: TabConfig[] = [
  { id: "topIssues", label: "Top Issues", icon: AlertTriangle },
  { id: "findings", label: "Findings", icon: ShieldAlert },
  { id: "recommendations", label: "Recommendations", icon: Lightbulb },
  { id: "goodPractice", label: "Good Practice", icon: ThumbsUp },
  { id: "overview", label: "Overview", icon: Inbox },
];

function plural(count: number, word: string): string {
  return count === 1 ? word : `${word}s`;
}

type CardTone = "red" | "amber" | "blue" | "green" | "violet";

function getCardData(
  item: Reports,
  tab: ReportTab,
): { content: string; badge: string; tone: CardTone } {
  switch (tab) {
    case "topIssues":
      return {
        content: item.risks.join(" • "),
        badge: `${item.risks.length} ${plural(item.risks.length, "risk")}`,
        tone: "red",
      };
    case "findings":
      return {
        content: item.security.findings.join(" • "),
        badge: `${item.security.findings.length} ${plural(
          item.security.findings.length,
          "finding",
        )}`,
        tone: "amber",
      };
    case "recommendations":
      return {
        content: item.security.recommendations.join(" • "),
        badge: `${item.security.recommendations.length} ${plural(
          item.security.recommendations.length,
          "recommendation",
        )}`,
        tone: "blue",
      };
    case "goodPractice":
      return {
        content: item.codeQuality.strengths.join(" • "),
        badge: `${item.codeQuality.strengths.length} ${plural(
          item.codeQuality.strengths.length,
          "strength",
        )}`,
        tone: "green",
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

const ReportField = ({ reports, getAnalysis }: ReportsData) => {
  const reportList: Reports[] = Array.isArray(reports) ? reports : [];

  // Single source of truth for the active tab, with a default so the UI
  // always has something on screen from the very first render.
  const [activeTab, setActiveTab] = useState<ReportTab>("topIssues");

  const getName = new Map<string, string>(
    (getAnalysis ?? []).map(item => [item._id, item.name]),
  );

  const tabCounts: Record<ReportTab, number> = {
    topIssues: reportList.reduce((sum, item) => sum + item.risks.length, 0),
    findings: reportList.reduce(
      (sum, item) => sum + item.security.findings.length,
      0,
    ),
    recommendations: reportList.reduce(
      (sum, item) => sum + item.security.recommendations.length,
      0,
    ),
    goodPractice: reportList.reduce(
      (sum, item) => sum + item.codeQuality.strengths.length,
      0,
    ),
    overview: reportList.length,
  };

  const hasReports = reportList.length > 0;
  const visibleReports = reportList.slice(0, 5);

  return (
    <section className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
      {/* —— Tabs —— */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 p-2">
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
                "relative inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-semibold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-400/60",
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-300/40"
                  : "bg-transparent text-[#848484] hover:bg-indigo-50 hover:text-indigo-700 active:scale-[0.97]",
              ].join(" ")}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${
                  isActive ? "text-white" : "text-[#9ea2b3]"
                }`}
              />
              <span className="truncate">{label}</span>
              <span
                className={[
                  "rounded-full px-1.5 py-0.5 text-[11px] font-bold tabular-nums",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500",
                ].join(" ")}
              >
                {tabCounts[id]}
              </span>
            </button>
          );
        })}
      </div>

      {/* —— Report cards —— */}
      {/* key={activeTab} remounts the list on every tab switch, replaying the
          fade-slide animation so the user gets clear visual confirmation the
          data changed. */}
      <div className="min-h-[230px] flex-1">
        {!hasReports ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
              <Inbox className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                No reports yet
              </p>
              <p className="mt-1 text-[13px] text-gray-400">
                Reports from your code analyses will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div key={activeTab} className="animate-fade-slide-in">
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

      {/* —— View all / Show less —— */}
      {hasReports && (
        <Link
          to="/reports"
          className="group flex w-full items-center justify-center gap-1.5 bg-linear-to-r from-indigo-50 to-violet-50 px-4 py-3 text-[14px] font-semibold text-indigo-700 transition-all duration-200 hover:from-indigo-100 hover:to-violet-100 hover:text-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          View all reports ({reportList.length} {plural(reportList.length, "report")})
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      )}
    </section>
  );
};

export default ReportField;
