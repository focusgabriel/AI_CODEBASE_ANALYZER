import { AnalysisCard } from "./AnalysisCard";
import ScoreCircle from "./Score";
import type { Analysis, ScoreTrend } from "../types/dashboard";
import { Link } from "react-router-dom";

interface AnalysisData {
  getAnalysis: Analysis[];
  scoreTrend: ScoreTrend;
}

const AnalysisField = ({ getAnalysis, scoreTrend }: AnalysisData) => {
  const reportData: Analysis[] = Array.isArray(getAnalysis) ? getAnalysis : [];

  // Build a lookup of analysisId -> score from the score trend data
  const scoreMap = new Map<string, number>(
    (scoreTrend?.trend ?? []).map(item => [item.analysisId, item.score]),
  );

  const formatDate = (dateValue: Date | string) => {
    const newDate = new Date(dateValue);

    return newDate.toLocaleDateString("en-Us", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex h-auto w-full flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3v18h18" />
              <path d="M7 15l3-3 3 3 4-5" />
            </svg>
          </div>
          <div>
            <p className="text-[14px] font-bold text-slate-900">
              Recent Analysis
            </p>
            <p className="text-[11px] text-slate-400">
              {reportData.length}{" "}
              {reportData.length === 1 ? "project" : "projects"} analyzed
            </p>
          </div>
        </div>

        <button
          type="button"
          className="cursor-pointer rounded-lg px-2.5 py-1 text-[12px] font-semibold text-indigo-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
        >
          <Link to="/analyses"> 
            View All
          </Link>
        </button>
      </div>

      <div className="flex-1 space-y-1 py-4 overflow-y-auto pr-1">
        {reportData.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50">
              <svg
                className="h-5 w-5 text-slate-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="M7 15l3-3 3 3 4-5" />
              </svg>
            </div>
            <p className="text-[13px] font-medium text-slate-500">
              No analyses yet
            </p>
            <p className="text-[12px] text-slate-400">
              Upload a repository to see results here.
            </p>
          </div>
        ) : (
          reportData.slice(0, 5).map(item => {
            const score = scoreMap.get(item._id) ?? 0;

            return (
              <AnalysisCard
                key={item.reportId ?? new Date(item.createdAt).toISOString()}
                title={item.name}
                date={formatDate(item.createdAt)}
                score={<ScoreCircle score={Number(score.toFixed(0))} />}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default AnalysisField;