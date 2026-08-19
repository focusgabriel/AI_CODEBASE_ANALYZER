import type { ChangeEvent } from "react";
import { ChevronDown } from "lucide-react";

export interface AnalysisOption {
  _id: string;
  userId: string;
  name: string;
  status: string;
  sourceLocation: string;
  reportId: string;
  startedAt: Date;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface AnalysisSelectorProps {
  analyses: AnalysisOption[];
  selectedAnalysisId: string;
  onChange: (analysisId: string) => void;
}

export default function AnalysisSelector({
  analyses,
  selectedAnalysisId,
  onChange,
}: AnalysisSelectorProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="w-full">
      <label
        htmlFor="analysis"
        className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
      >
        Select Analysis
      </label>

      <div className="relative">
        <select
          id="analysis"
          value={selectedAnalysisId}
          onChange={handleChange}
          className="w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm font-medium text-white outline-none backdrop-blur-sm transition-all duration-200 hover:border-white/20 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/20"
        >
          {analyses.map(analysis => (
            <option
              key={analysis._id}
              value={analysis._id}
              className="bg-slate-900 text-white"
            >
              {analysis.name || "Unnamed Analysis"}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}