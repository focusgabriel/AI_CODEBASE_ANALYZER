/** @format */

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { AnaltyicsCard } from "../components/AnaltyicsCard";
import ScoreCircle from "../components/Score";
import type { Analysis, ScoreTrend } from "../types/dashboard";
import {
  AllAnalysisForUser,
  deleteAnalysis,
  renameAnalysis,
} from "../services/analysis.services";

interface AnalysisData {
  // getAnalysis: Analysis[];
  scoreTrend: ScoreTrend;
}

const AnalyticsPage = ({ scoreTrend }: AnalysisData) => {
  // `reportData` will hold the list fetched from server
  const [reportData, setReportData] = useState<Analysis[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [filters, setFilters] = useState({
    name: "",
    status: "",
    search: "",
  });
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState<string>("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalAnalyses, setTotalAnalyses] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Keep typing responsive while avoiding one network request per keystroke.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const search = searchInput.trim();
      setFilters(previous =>
        previous.search === search ? previous : { ...previous, search },
      );
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  // Single effect to fetch data whenever filters/sort/page/limit change
  useEffect(() => {
    let isCurrentRequest = true;

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await AllAnalysisForUser({
          name: filters.name,
          status: filters.status,
          sort,
          order,
          search: filters.search,
          page,
          limit,
        });

        if (!isCurrentRequest) return;

        setReportData(response.getAnalysis);
        setTotalPages(Math.max(response.pagination.totalLimit, 1));
        setTotalAnalyses(response.pagination.total);

        // A deletion or an updated filter can make the current page unavailable.
        if (response.pagination.page !== page) {
          setPage(response.pagination.page);
        }
      } catch (error) {
        if (!isCurrentRequest) return;

        console.error(error);
        setReportData([]);
        toast.error("Unable to load analyses. Please try again.");
      } finally {
        if (isCurrentRequest) setIsLoading(false);
      }
    };

    void fetchData();

    return () => {
      isCurrentRequest = false;
    };
  }, [
    filters.name,
    filters.status,
    sort,
    filters.search,
    order,
    page,
    limit,
  ]);

  const pageItems = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = new Set([1, totalPages, page - 1, page, page + 1]);
    return [...pages]
      .filter(item => item >= 1 && item <= totalPages)
      .sort((a, b) => a - b);
  }, [page, totalPages]);

  const firstVisibleAnalysis = totalAnalyses === 0 ? 0 : (page - 1) * limit + 1;
  const lastVisibleAnalysis = Math.min(page * limit, totalAnalyses);
  const hasActiveFilters = Boolean(filters.search || filters.status || order !== "desc");

  const resetFilters = () => {
    setSearchInput("");
    setFilters({ name: "", status: "", search: "" });
    setSort("createdAt");
    setOrder("desc");
    setPage(1);
  };

  // Lookup analysisId -> score from score trend
  const scoreMap = new Map<string, number>(
    (scoreTrend?.trend ?? []).map(item => [item.analysisId, item.score]),
  );

  const formatDate = (dateValue: Date | string) => {
    const dateObj = new Date(dateValue);

    return dateObj.toLocaleDateString("en-Us", {
      day: "numeric",
      month: "short",
      year: "numeric",
      minute: "numeric",
      hour: "numeric",
      second: "numeric",
    });
  };

  const handleEdit = (item: Analysis) => {
    setEditingId(item._id);
    setEditName(item.name);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleEditSave = async (item: Analysis) => {
    if (!editName.trim()) {
      toast.error("Analysis name cannot be empty.");
      return;
    }

    try {
      await renameAnalysis(item._id, editName.trim());

      setReportData(prev =>
        prev.map(analysis =>
          analysis._id === item._id
            ? { ...analysis, name: editName.trim() }
            : analysis,
        ),
      );

      toast.success("Analysis renamed successfully.");
      handleEditCancel();
    } catch (error) {
      console.error(error);
      toast.error("Failed to rename analysis.");
    }
  };

  const handleDelete = async (item: Analysis) => {
    if (
      !window.confirm(
        `Delete analysis "${item.name}"? This cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await deleteAnalysis(item._id);

      setReportData(prev =>
        prev.filter(analysis => analysis._id !== item._id),
      );

      if (reportData.length === 1 && page > 1) {
        setPage(currentPage => currentPage - 1);
      } else {
        setTotalAnalyses(total => Math.max(total - 1, 0));
      }

      toast.success("Analysis deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete analysis.");
    }
  };

  return (
    <div className="flex h-full lg:w-[80%] w-full lg:mx-auto  flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
            <p className="text-[14px] font-bold text-slate-900">Recent Analysis</p>
            <p className="text-[11px] text-slate-400">
              {totalAnalyses} {totalAnalyses === 1 ? "project" : "projects"} analyzed
            </p>
          </div>
        </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex w-fit items-center gap-1.5 self-start rounded-lg px-2.5 py-1.5 text-[12px] font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 sm:self-auto"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Clear filters
            </button>
          )}
        </div>

        <form
          className="mt-4 grid gap-2 rounded-xl border border-slate-200/80 bg-slate-50/80 p-2.5 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_170px_150px] lg:items-end"
          onSubmit={event => event.preventDefault()}
          aria-label="Filter analyses"
        >
          <label className="block min-w-0">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Search
            </span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="search"
                value={searchInput}
                onChange={event => setSearchInput(event.target.value)}
                placeholder="Search repository or status…"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-9 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Status
            </span>
            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <select
                value={filters.status}
                onChange={event => {
                  setFilters(previous => ({ ...previous, status: event.target.value }));
                  setPage(1);
                }}
                className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-8 text-[13px] font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              >
                <option value="">All statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="UPLOADING">Uploading</option>
                <option value="EXTRACTING">Extracting</option>
                <option value="ANALYZING">Analyzing</option>
                <option value="PROCESSING">Processing</option>
                <option value="FAILED">Failed</option>
              </select>
              <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rotate-90 text-slate-400" aria-hidden="true" />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Sort by date
            </span>
            <select
              value={order}
              onChange={event => {
                setOrder(event.target.value as "asc" | "desc");
                setPage(1);
              }}
              className="h-10 w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </label>
        </form>
      </div>

      {/* Column headers — rendered once above the list */}
      <div className="mb-2 hidden grid-cols-12 gap-3 border-b border-slate-100 px-3 pb-2 md:grid">
        <div className="col-span-4 pl-[46px]">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Repository
          </p>
        </div>
        <div className="col-span-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Status
          </p>
        </div>
        <div className="col-span-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Date
          </p>
        </div>
        <div className="col-span-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Score
          </p>
        </div>
        <div className="col-span-1" />
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-slate-400">
            <LoaderCircle className="h-5 w-5 animate-spin text-indigo-500" aria-hidden="true" />
            <p className="text-[13px] font-medium">Loading analyses…</p>
          </div>
        ) : reportData?.length === 0 ? (
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
            <p className="text-[13px] font-medium text-slate-500">No analyses yet</p>
            <p className="text-[12px] text-slate-400">
              Upload a repository to see results here.
            </p>
          </div>
        ) : (
          reportData?.map(item => {
            const score = scoreMap.get(item._id) ?? 0;

            return (
              <div
                key={item.reportId ?? new Date(item.createdAt).toISOString()}
              >
                {editingId === item._id ? (
                  <div className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/50 px-3 py-2">
                    <input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          void handleEditSave(item);
                        }
                        if (e.key === "Escape") {
                          handleEditCancel();
                        }
                      }}
                      className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] text-gray-900 outline-none transition-colors focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                      placeholder="Enter new analysis name"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => void handleEditSave(item)}
                      className="shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-indigo-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleEditCancel}
                      className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <AnaltyicsCard
                    title={item.name}
                    status={item.status}
                    date={formatDate(new Date(item.createdAt).toISOString())}
                    score={<ScoreCircle score={Number(score.toFixed(0))} />}
                    onEdit={() => handleEdit(item)}
                    onDelete={() => void handleDelete(item)}
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination controls */}
      <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-600">
            {firstVisibleAnalysis}–{lastVisibleAnalysis} of {totalAnalyses}
          </span>
          <label className="flex items-center gap-1.5 whitespace-nowrap">
            Rows
            <select
              value={limit}
              onChange={event => {
                setLimit(Number(event.target.value));
                setPage(1);
              }}
              className="cursor-pointer rounded-md border border-slate-200 bg-white px-1.5 py-1 font-medium text-slate-600 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              aria-label="Analyses per page"
            >
              {[5, 10, 20, 50].map(size => <option key={size} value={size}>{size}</option>)}
            </select>
          </label>
        </div>
        <nav className="flex items-center justify-between gap-1 sm:justify-end" aria-label="Pagination">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-[12px] font-semibold text-slate-600 shadow-sm transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-300 disabled:shadow-none"
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Previous</span>
          </button>
          <div className="flex items-center gap-1" aria-live="polite">
            {pageItems.map((pageItem, index) => (
              <div key={pageItem} className="flex items-center gap-1">
                {index > 0 && pageItem - pageItems[index - 1] > 1 && (
                  <span className="px-0.5 text-sm text-slate-400" aria-hidden="true">…</span>
                )}
                <button
                  type="button"
                  onClick={() => setPage(pageItem)}
                  aria-current={pageItem === page ? "page" : undefined}
                  aria-label={`Go to page ${pageItem}`}
                  className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[12px] font-semibold transition-all ${
                    pageItem === page
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                      : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
                >
                  {pageItem}
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            className="flex h-8 items-center gap-1 rounded-lg bg-indigo-600 px-2.5 text-[12px] font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
            aria-label="Go to next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default AnalyticsPage;
