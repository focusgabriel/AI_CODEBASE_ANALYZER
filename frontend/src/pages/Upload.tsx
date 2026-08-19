/** @format */

import { useRef, useState, useEffect, useCallback } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileArchive,
  FolderArchive,
  UploadCloud,
  Loader2,
  Sparkles,
  ShieldCheck,
  Zap,
  Lock,
  GitBranch,
} from "lucide-react";
import {
  createAnalysis,
  getAnalysisStatus,
  uploadRepository,
  type AnalysisBackendStatus,
} from "../services/analysis.services";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const FEATURE_PILLS = [
  { icon: ShieldCheck, label: "Secure upload", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  { icon: Zap, label: "AI-powered", color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
  { icon: Lock, label: "Private", color: "text-violet-600 bg-violet-50 border-violet-100" },
];

/**
 * Informative step labels shown while the server runs the blocking pipeline.
 * They relay what the engine is doing (right-to-left in backends flow) but are
 * purely informational — the progress bar below stays indeterminate until the
 * server resolves, so we never falsely claim a stage is complete.
 */
const PROCESSING_STEPS = [
  "Processing ZIP file…",
  "Extracting repository…",
  "Scanning files & languages…",
  "Generating & building report…",
];

const POLL_INTERVAL_MS = 1500;

type UploadPhase = "idle" | "uploading" | "processing" | "done" | "error";

const UploadRepository = () => {
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [serverStatus, setServerStatus] = useState<AnalysisBackendStatus>("PENDING");

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
      setServerStatus("COMPLETED");

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
          const currentStatus = statusResponse.data.status;

          if (!mountedRef.current) return;

          setServerStatus(currentStatus);

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
          console.warn("[upload] status poll failed:", pollError);
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
      setServerStatus("PENDING");
      setPhase("uploading");
      finalizedRef.current = false;

      const analysisResponse = await createAnalysis();
      const newAnalysisId = analysisResponse.analysisId;

      // Keep the real server status in sync while the pipeline runs.
      startPolling(newAnalysisId);

      // Real byte-level progress via the XMLHttpRequest underneath Axios.
      await uploadRepository(newAnalysisId, file, progressEvent => {
        if (progressEvent.total) {
          const pct = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100,
          );
          setUploadProgress(prev => Math.max(prev, Math.min(pct, 100)));

          // Bytes are fully transmitted but the controller is still working.
          if (pct >= 100) {
            setPhase("processing");
          }
        }
      });

      // The POST only resolves after the backend fully completed every step
      // (extract → scan → analyze → report → COMPLETED). This is the
      // authoritative success signal.
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

  const statusTitle = useCallback(() => {
    switch (phase) {
      case "uploading":
        return uploadProgress >= 100
          ? "Finishing upload…"
          : "Uploading ZIP…";
      case "processing":
        return "Processing your repository…";
      case "done":
        return "Analysis complete!";
      default:
        return "";
    }
  }, [phase, uploadProgress]);

  const statusSubtext = useCallback(() => {
    switch (phase) {
      case "uploading":
        return uploadProgress >= 100
          ? "Server is now analysing your codebase."
          : "Sending your ZIP to the server securely.";
      case "processing":
        return "This can take a minute on larger repositories.";
      case "done":
        return "Opening your analysis report…";
      default:
        return "";
    }
  }, [phase, uploadProgress]);

  const busy = phase === "uploading" || phase === "processing";

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      {/* Soft background accents */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-200/30 to-violet-200/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-gradient-to-tr from-amber-100/40 to-orange-100/20 blur-3xl" />

      <div className="relative mx-auto w-full max-w-5xl">
        {/* Page header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-indigo-600 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              AI Codebase Analyzer
            </div>
            <h1 className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
              Upload your repository
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-500 sm:text-base">
              Get an AI-powered analysis with rich insights in seconds. Drop your
              codebase and let our engine do the rest.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {FEATURE_PILLS.map(pill => (
              <span
                key={pill.label}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${pill.color}`}
              >
                <pill.icon className="h-3.5 w-3.5" />
                {pill.label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.2)]">
          {/* Top accent line */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />

          {/* Header */}
          <div className="relative border-b border-slate-100 px-6 py-5 sm:px-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200">
                  <FolderArchive size={26} strokeWidth={2.2} />
                </div>
                {phase === "done" && (
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
                    <CheckCircle2 size={12} className="text-white" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold tracking-tight text-slate-900">
                  Upload & Analyze Codebase
                </h2>
                <p className="text-sm text-slate-500">
                  Drop a ZIP and get AI-powered insights
                </p>
              </div>
              <div className="ml-auto hidden shrink-0 items-center gap-2 rounded-full border border-indigo-100 bg-white px-3.5 py-1.5 text-[11px] font-semibold text-indigo-600 shadow-sm sm:inline-flex">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      busy
                        ? "animate-ping bg-indigo-400"
                        : phase === "done"
                          ? "bg-emerald-400"
                          : "bg-indigo-400"
                    }`}
                  />
                  <span
                    className={`relative inline-flex h-2 w-2 rounded-full ${
                      phase === "done" ? "bg-emerald-500" : "bg-indigo-500"
                    }`}
                  />
                </span>
                {busy ? "Working" : phase === "done" ? "Complete" : "Ready"}
              </div>
            </div>
          </div>

          <div className="relative p-6 sm:p-8">
            <input
              ref={inputRef}
              className="sr-only"
              id="repository-upload"
              type="file"
              accept=".zip,application/zip,application/x-zip-compressed"
              onChange={handleFileChange}
              disabled={busy}
            />

            <div
              aria-describedby="upload-help"
              className={`group relative flex min-h-80 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[1.75rem] border-2 border-dashed px-6 py-10 text-center transition-all duration-300 ${
                isDragging
                  ? "scale-[1.01] border-indigo-500 bg-gradient-to-br from-indigo-50 via-violet-50 to-white shadow-inner shadow-indigo-100"
                  : "border-slate-200 bg-gradient-to-br from-slate-50/80 via-white to-indigo-50/20 hover:border-indigo-300 hover:bg-gradient-to-br hover:from-indigo-50/40 hover:via-white hover:to-violet-50/30"
              } ${busy ? "cursor-wait opacity-90" : ""}`}
              role="button"
              tabIndex={busy ? -1 : 0}
              onClick={() => {
                if (!busy) inputRef.current?.click();
              }}
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
              {/* Icon */}
              <div
                className={`relative mb-6 flex h-24 w-24 items-center justify-center rounded-[1.75rem] transition-all duration-300 ${
                  isDragging
                    ? "scale-110 rotate-6 bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-2xl shadow-indigo-300"
                    : busy
                      ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200"
                      : "bg-gradient-to-br from-white to-indigo-50 text-indigo-600 shadow-lg shadow-indigo-100/50 ring-1 ring-indigo-100 group-hover:-translate-y-1.5 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-indigo-200/50"
                }`}
              >
                {busy ? (
                  <Loader2 size={42} strokeWidth={1.8} className="animate-spin" />
                ) : phase === "done" ? (
                  <CheckCircle2 size={42} strokeWidth={1.8} />
                ) : (
                  <UploadCloud size={42} strokeWidth={1.8} />
                )}
              </div>

              {busy || phase === "done" ? (
                <div className="relative w-full max-w-md animate-fade-slide-in">
                  {/* Status title */}
                  <p className="text-base font-bold text-slate-900 sm:text-lg">
                    {statusTitle()}
                  </p>

                  {/* Progress bar */}
                  <div className="relative mt-5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    {phase === "processing" ? (
                      /* Indeterminate activity bar — the server provides no
                         per-stage percentage. It stays moving until the POST
                         resolves, so it truly represents live processing. */
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

                  {/* Status line */}
                  <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
                    {phase === "processing" ? (
                      <span className="relative inline-flex h-5 overflow-hidden">
                        {PROCESSING_STEPS.map((step, index) => (
                          <span
                            key={step}
                            className="processing-step absolute inset-x-0 truncate text-xs font-medium text-slate-500"
                            style={{ animationDelay: `${index * 1.4}s` }}
                          >
                            {step}
                          </span>
                        ))}
                      </span>
                    ) : phase === "done" ? (
                      <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
                        <CheckCircle2 size={14} /> {statusSubtext()}
                      </span>
                    ) : (
                      <span className="font-medium tabular-nums text-indigo-600">
                        {statusSubtext()} · {uploadProgress}%
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative animate-fade-slide-in">
                  <p className="text-xl font-bold text-slate-900 sm:text-2xl">
                    {isDragging ? (
                      <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                        Drop your archive to upload
                      </span>
                    ) : (
                      "Drag & drop your ZIP here"
                    )}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    or click anywhere in this area to browse
                  </p>

                  <div className="mt-7 flex items-center justify-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-xl group-hover:shadow-indigo-300/50">
                      <UploadCloud size={18} /> Choose ZIP file
                    </span>
                    <span className="hidden items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-600 shadow-sm transition-all duration-300 group-hover:border-indigo-200 group-hover:text-indigo-600 sm:inline-flex">
                      <GitBranch size={16} />
                      Max 300MB
                    </span>
                  </div>

                  <p
                    id="upload-help"
                    className="mt-5 text-xs text-slate-400"
                  >
                    ZIP archives only. Keep your repository structure for best results.
                  </p>
                </div>
              )}
            </div>

            {/* Selected file indicator */}
            {selectedFile && !busy && !error && (
              <div className="mt-6 flex items-center gap-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50/50 px-5 py-4 text-left shadow-sm animate-fade-slide-in">
                <div className="relative">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-200">
                    {phase === "done" ? (
                      <CheckCircle2 size={22} />
                    ) : (
                      <FileArchive size={22} />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-emerald-950">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-emerald-700">
                    {formatFileSize(selectedFile.size)}
                    {phase === "done"
                      ? " · Analysis complete"
                      : " · ZIP archive ready"}
                  </p>
                </div>
                <span className="hidden shrink-0 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-emerald-600 shadow-sm ring-1 ring-emerald-100 sm:inline-flex">
                  {phase === "done" ? "Analyzed" : "Ready to analyze"}
                </span>
              </div>
            )}

            {error && (
              <div
                className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-100 bg-gradient-to-r from-rose-50 to-red-50/50 px-5 py-4 text-left shadow-sm animate-fade-slide-in"
                role="alert"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-red-500 text-white shadow-md shadow-rose-200">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-rose-950">
                    Upload couldn't complete
                  </p>
                  <p className="mt-0.5 text-sm text-rose-700">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default UploadRepository;