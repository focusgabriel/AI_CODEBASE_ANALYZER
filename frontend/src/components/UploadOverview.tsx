/** @format */

import { useRef, useState, useEffect, useCallback } from "react";
import { CheckCircle2, UploadCloud } from "lucide-react";
import {
  createAnalysis,
  getAnalysisStatus,
  uploadRepository,
  type AnalysisBackendStatus,
} from "../services/analysis.services";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const POLL_INTERVAL_MS = 1500;

/** Tiny informative captions shown while the server processes the archive. */
const PROCESSING_STEPS = [
  "Processing ZIP file…",
  "Extracting repository…",
  "Scanning files & languages…",
  "Generating & building report…",
];

type OverviewPhase = "idle" | "uploading" | "processing" | "done" | "error";

/**
 * Simple upload widget for the dashboard overview.
 *
 * Kept intentionally minimal — no cards, no feature pills, no decorative
 * icons. Just a clean dropzone that matches the height of its grid siblings
 * (HowItWorks, AnalysisField) so all three panels align perfectly.
 */
const UploadOverview = () => {
  const [phase, setPhase] = useState<OverviewPhase>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);
  const finalizedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    finalizedRef.current = false;
    return () => {
      mountedRef.current = false;
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, []);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const finalize = useCallback(
    (analysisId: string) => {
      if (finalizedRef.current) return;
      finalizedRef.current = true;
      stopPolling();
      setPhase("done");

      toast.success("Repository analyzed successfully", {
        position: "top-center",
        duration: 2500,
      });

      setTimeout(() => {
        if (mountedRef.current) {
          navigate(`/analyses/${analysisId}`);
        }
      }, 1800);
    },
    [navigate, stopPolling],
  );

  const startPolling = useCallback(
    (analysisId: string) => {
      stopPolling();
      pollRef.current = setInterval(async () => {
        try {
          const statusResponse = await getAnalysisStatus(analysisId);
          const currentStatus: AnalysisBackendStatus = statusResponse.data.status;

          if (!mountedRef.current) return;

          if (currentStatus === "COMPLETED") {
            finalize(analysisId);
          } else if (currentStatus === "FAILED") {
            finalizedRef.current = true;
            stopPolling();
            setPhase("error");
            setError(
              "The server reported an error while analysing your repository. Please try again.",
            );
          }
        } catch (pollError) {
          console.warn("[upload-overview] status poll failed:", pollError);
        }
      }, POLL_INTERVAL_MS);
    },
    [finalize, stopPolling],
  );

  const handleUpload = async (file: File) => {
    setError(null);

    if (!file.name.toLowerCase().endsWith(".zip")) {
      setSelectedFile(null);
      setError("That isn't a ZIP archive. Please choose a .zip file.");
      return;
    }

    try {
      setSelectedFile(file);
      setUploadProgress(0);
      setPhase("uploading");
      finalizedRef.current = false;

      const analysisResponse = await createAnalysis();
      const newAnalysisId = analysisResponse.analysisId;

      startPolling(newAnalysisId);

      await uploadRepository(newAnalysisId, file, progressEvent => {
        if (progressEvent.total) {
          const pct = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100,
          );
          setUploadProgress(prev => Math.max(prev, Math.min(pct, 100)));

          if (pct >= 100) {
            setPhase("processing");
          }
        }
      });

      finalize(newAnalysisId);
    } catch (uploadError: unknown) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "Upload failed. Please try again.";

      finalizedRef.current = true;
      stopPolling();
      setPhase("error");
      setError(message);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleUpload(file);
    event.target.value = "";
  };

  const formatFileSize = (size: number) => {
    if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const busy = phase === "uploading" || phase === "processing";

  return (
    <section className="flex h-full w-full flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
      {/* Simple header */}
      <div className="mb-4">
        <p className="text-[14px] font-bold text-slate-900">Upload Codebase</p>
        <p className="text-[11px] text-slate-400">Drop a ZIP to analyze</p>
      </div>

      <input
        ref={inputRef}
        className="sr-only"
        id="overview-repository-upload"
        type="file"
        accept=".zip,application/zip,application/x-zip-compressed"
        onChange={handleFileChange}
        disabled={busy}
      />

      {/* Simple dropzone — no cards, no feature pills */}
      <div
        className={`group relative flex min-h-40 flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition-all duration-300 ${
          isDragging
            ? "scale-[1.01] border-indigo-500 bg-indigo-50"
            : "border-slate-200 bg-slate-50/70 hover:border-indigo-300 hover:bg-indigo-50/40"
        } ${busy ? "cursor-wait opacity-90" : ""}`}
        role="button"
        tabIndex={busy ? -1 : 0}
        onClick={() => !busy && inputRef.current?.click()}
        onKeyDown={event => {
          if (!busy && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={event => {
          event.preventDefault();
          if (!busy) setIsDragging(true);
        }}
        onDragOver={event => event.preventDefault()}
        onDragLeave={event => {
          if (event.currentTarget === event.target) setIsDragging(false);
        }}
        onDrop={event => {
          event.preventDefault();
          setIsDragging(false);
          const file = event.dataTransfer.files[0];
          if (file && !busy) handleUpload(file);
        }}
      >
        {busy || phase === "done" ? (
          <div className="flex w-full max-w-xs flex-col items-center animate-fade-slide-in">
            <p className="text-[13px] font-semibold text-slate-800">
              {phase === "uploading"
                ? uploadProgress >= 100
                  ? "Finishing upload…"
                  : "Uploading ZIP…"
                : phase === "processing"
                  ? "Processing your repository…"
                  : "Analysis complete!"}
            </p>

            {/* Simple progress bar */}
            <div className="relative mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              {phase === "processing" ? (
                <div className="absolute inset-0 overflow-hidden">
                  <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 progress-shimmer" />
                </div>
              ) : (
                <div
                  className={`h-full rounded-full transition-all duration-200 ${
                    phase === "done"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                      : "bg-gradient-to-r from-indigo-500 to-violet-500"
                  }`}
                  style={{ width: `${uploadProgress}%` }}
                />
              )}
            </div>

            <div className="mt-2 flex h-4 items-center justify-center text-[11px] text-slate-400">
              {phase === "processing" ? (
                <span className="relative inline-flex h-4 overflow-hidden">
                  {PROCESSING_STEPS.map((step, index) => (
                    <span
                      key={step}
                      className="processing-step absolute inset-x-0 truncate text-[11px] font-medium text-slate-500"
                      style={{ animationDelay: `${index * 1.4}s` }}
                    >
                      {step}
                    </span>
                  ))}
                </span>
              ) : phase === "done" ? (
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                  <CheckCircle2 size={13} /> Redirecting to report…
                </span>
              ) : (
                <span className="tabular-nums text-indigo-500">
                  {uploadProgress}%
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div
              className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${
                isDragging
                  ? "scale-110 bg-gradient-to-br from-indigo-600 to-violet-600 text-white"
                  : "bg-white text-indigo-600 ring-1 ring-indigo-100 group-hover:-translate-y-0.5 group-hover:shadow-md"
              }`}
            >
              <UploadCloud size={22} strokeWidth={1.8} />
            </div>
            <p className="text-[13px] font-semibold text-slate-800">
              {isDragging ? "Drop to upload" : "Drag & drop your ZIP"}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              or click to browse · .zip only
            </p>
            <p className="mt-2.5 text-[10px] text-slate-400">
              <span className="font-medium text-indigo-500">Max 300MB</span> ·
              Keep your repository structure for best results
            </p>
          </div>
        )}
      </div>

      {/* Selected file / error */}
      {selectedFile && !busy && !error && (
        <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold text-emerald-950">
              {selectedFile.name}
            </p>
            <p className="text-[10px] text-emerald-700">
              {formatFileSize(selectedFile.size)} · ZIP ready
            </p>
          </div>
          <CheckCircle2 className="shrink-0 text-emerald-500" size={16} />
        </div>
      )}

      {error && (
        <div
          className="mt-3 flex items-start gap-2.5 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2.5"
          role="alert"
        >
          <p className="text-[12px] font-medium text-rose-700">{error}</p>
        </div>
      )}
    </section>
  );
};

export default UploadOverview;