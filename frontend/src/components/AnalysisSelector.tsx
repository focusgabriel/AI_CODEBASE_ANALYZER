import type { ChangeEvent } from "react";

export interface AnalysisOption {
  _id: string;
  name: string;
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
  const handleChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    onChange(event.target.value);
  };

  return (
    <div className="w-full max-w-sm">
      <label
        htmlFor="analysis"
        className="mb-2 block text-sm font-medium text-[#44445A]"
      >
        Analysis
      </label>

      <select
        id="analysis"
        value={selectedAnalysisId}
        onChange={handleChange}
        className="w-full rounded-xl border border-[#ECECF4] bg-white px-4 py-3 text-sm text-[#202033] outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10"
      >
        {analyses.map((analysis) => (
          <option
            key={analysis._id}
            value={analysis._id}
          >
            {analysis.name || "Unnamed Analysis"}
          </option>
        ))}
      </select>
    </div>
  );
}