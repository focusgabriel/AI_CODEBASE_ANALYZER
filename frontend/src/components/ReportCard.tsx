import type { JSX } from "react/jsx-runtime";
import { FileWarning } from "lucide-react";

interface ReportsProps {
  title: string;
  content: string;
  issues?: JSX.Element | string;
  /** Visual accent applied to the icon, badge and hover ring. */
  tone?: "indigo" | "red" | "amber" | "blue" | "green" | "violet" | "orange" | "pink";
}

const TONE_STYLES: Record<
  NonNullable<ReportsProps["tone"]>,
  { icon: string; badge: string; groupHover: string; bar: string }
> = {
  indigo: {
    icon: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
    badge:
      "border-indigo-200 bg-indigo-50 text-indigo-700 group-hover:border-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
    groupHover: "hover:border-indigo-200 hover:shadow-indigo-100",
    bar: "bg-indigo-400",
  },
  red: {
    icon: "bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white",
    badge:
      "border-red-200 bg-red-50 text-red-700 group-hover:border-red-600 group-hover:bg-red-600 group-hover:text-white",
    groupHover: "hover:border-red-200 hover:shadow-red-100",
    bar: "bg-red-400",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white",
    badge:
      "border-amber-200 bg-amber-50 text-amber-700 group-hover:border-amber-500 group-hover:bg-amber-500 group-hover:text-white",
    groupHover: "hover:border-amber-200 hover:shadow-amber-100",
    bar: "bg-amber-400",
  },
  blue: {
    icon: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    badge:
      "border-blue-200 bg-blue-50 text-blue-700 group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    groupHover: "hover:border-blue-200 hover:shadow-blue-100",
    bar: "bg-blue-400",
  },
  green: {
    icon: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700 group-hover:border-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
    groupHover: "hover:border-emerald-200 hover:shadow-emerald-100",
    bar: "bg-emerald-400",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white",
    badge:
      "border-violet-200 bg-violet-50 text-violet-700 group-hover:border-violet-600 group-hover:bg-violet-600 group-hover:text-white",
    groupHover: "hover:border-violet-200 hover:shadow-violet-100",
    bar: "bg-violet-400",
  },
  orange: {
    icon: "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white",
    badge:
      "border-orange-200 bg-orange-50 text-orange-700 group-hover:border-orange-600 group-hover:bg-orange-600 group-hover:text-white",
    groupHover: "hover:border-orange-200 hover:shadow-orange-100",
    bar: "bg-orange-400",
  },
  pink: {
    icon: "bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white",
    badge:
      "border-pink-200 bg-pink-50 text-pink-700 group-hover:border-pink-600 group-hover:bg-pink-600 group-hover:text-white",
    groupHover: "hover:border-pink-200 hover:shadow-pink-100",
    bar: "bg-pink-400",
  },
};

export const ReportsCard = ({
  title,
  content,
  issues,
  tone = "indigo",
}: ReportsProps) => {
  const styles = TONE_STYLES[tone];

  return (
    <section
      className={`group relative flex items-center justify-between gap-3 overflow-hidden border border-transparent bg-white py-3 pl-5 pr-4 transition-all duration-200 hover:shadow-md ${styles.groupHover} hover:bg-gray-50/70`}
    >
      {/* Left accent bar */}
      <span
        className={`absolute inset-y-0 left-0 w-1 origin-bottom scale-y-0 transition-transform duration-300 group-hover:origin-top group-hover:scale-y-100 ${styles.bar}`}
      />

      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200 group-hover:scale-110 ${styles.icon}`}
        >
          <FileWarning className="h-5 w-5 transition-transform duration-200 group-hover:rotate-6" />
        </div>

        <div className="min-w-0">
          <h2 className="max-w-[60%] truncate text-[13px] font-semibold text-gray-900">
            {title}
          </h2>
          <p className="mt-0.5 w-[90%] text-[13px] leading-relaxed text-gray-500">
            {content}
          </p>
        </div>
      </div>

      <div
        className={`flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold transition-all duration-200 group-hover:scale-105 ${styles.badge}`}
      >
        {issues}
      </div>
    </section>
  );
};