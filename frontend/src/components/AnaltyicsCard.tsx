/** @format */

import { FileArchive, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { JSX } from "react/jsx-runtime";

interface analytics {
  title: string;
  status: string;
  date: string;
  score?: JSX.Element;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: string;
}

export const AnaltyicsCard = ({
  title,
  status,
  date,
  score,
  onEdit,
  onDelete,
  onClick,
}: analytics) => {
  const isCompleted = status === "COMPLETED";

  return (
    <section>
      <div className="group w-full rounded-xl border border-transparent bg-white px-3 py-2.5 transition-all duration-200 hover:border-slate-100 hover:bg-slate-50/70">
        <div className="grid grid-cols-12 items-center gap-3">
          {/* Title column */}
          <Link
            to={onClick}
            className="col-span-4 flex min-w-0 items-center gap-2.5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors duration-200 group-hover:bg-indigo-600 group-hover:text-white">
              <FileArchive className="h-5 w-5" />
            </div>
            <h2 className="min-w-0 truncate text-[13px] font-semibold text-gray-900">
              {title}
            </h2>
          </Link>
          {/* Status column */}
          <Link to={onClick} className="col-span-2 min-w-0">
            <div
              className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                isCompleted
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {status}
            </div>
          </Link>
          {/* Date column */}
          <Link to={onClick} className="col-span-3 min-w-0">
            <p className="min-w-0 truncate text-[11px] text-gray-500">{date}</p>
          </Link>
          {/* Score column */}
          <Link to={onClick} className="col-span-2 min-w-0">
            <div className="flex shrink-0 items-center">{score}</div>
          </Link>
          {/* Actions column */}
          <div className="col-span-1 flex min-w-0 items-center justify-end">
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={onEdit}
                title="Edit analysis"
                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors duration-200 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={onDelete}
                title="Delete analysis"
                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
