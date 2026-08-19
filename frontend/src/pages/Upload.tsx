/** @format */

import { useRef, useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileArchive,
  FolderArchive,
  UploadCloud,
  FileSearch,
  Cpu,
  FileBarChart,
  Sparkles,
  RefreshCw,
  WifiOff,
} from "lucide-react";
import { createAnalysis, uploadRepository } from "../services/analysis.services";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type StageKey = "upload" | "extract" | "scan" | "analyze" | "report";

interface StageConfig {
  key: StageKey;
  label: string;
  description: string;
  icon: typeof FileArchive;
  barClass: string;
}

const STAGE_CONFIG: StageConfig[] = [
  { key: "upload", label: "Uploading", description: "Sending your ZIP securely", icon: UploadCloud, barClass: "bg-gradient-to-r from-indigo-500 to-violet-500" },
  { key: "extract", label: "Extracting", description: "Unzipping repository structure", icon: FolderArchive, barClass: "bg-gradient-to-r from-sky-500 to-blue-500" },
  { key: "scan", label: "Scanning", description: "Indexing files & languages", icon: FileSearch, barClass: "bg-gradient-to-r from-amber-500 to-orange-500" },
  { key: "analyze", label: "Analyzing", description: "AI engine reviewing structure & quality", icon: Cpu, barClass: "bg-gradient-to-r from-violet-500 to-purple-500" },
  { key: "report", label: "Building report", description: "Generating insights & score cards", icon: FileBarChart, barClass: "bg-gradient-to-r from-emerald-500 to-teal-500" },
];

const STAGE_DURATION: Record<StageKey, number> = {
  upload: 1200,
  extract: 1600,
  scan: 1800,
  analyze: 2800,
  report: 1200,
};

const UploadRepository = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCountdown, setRetryCountdown] = useState(5);
  const [connectionLost, setConnectionLost] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | null>(null);

  const currentStage = STAGE_CONFIG[currentStageIndex];
  const currentStageIsActive = isUploading && !connectionLost && !completed;

  // Main progress effect
  useEffect(() => {
    if (!isUploading || completed || connectionLost) return;

    let interval: ReturnType<typeof setInterval> | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const duration = STAGE_DURATION[currentStage.key];

    timeout = setTimeout(() => {
      if (currentStageIndex < STAGE_CONFIG.length - 1) {
        setCurrentStageIndex(idx => idx + 1);
        setStageProgress(0);
      } else {
        setCompleted(true);
        setStageProgress(100);
        if (analysisId) {
          setTimeout(() => {
            navigate(`/analyses/${analysisId}`);
          }, 800);
        }
      }
    }, duration);

    interval = setInterval(() => {
      setStageProgress(prev => {
        if (prev >= 100) return prev;
        return Math.min(prev + Math.floor(Math.random() * 8) + 4, 94);
      });
    }, 160);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [isUploading, connectionLost, completed, currentStageIndex, currentStage.key, analysisId, navigate]);

  // Retry countdown effect
  useEffect(() => {
    if (!isRetrying) return;
    if (retryCountdown <= 0) {
      setConnectionLost(false);
      setIsRetrying(false);
      setRetryCountdown(5);
      return;
    }
    const t = setTimeout(() => {
      setRetryCountdown(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [isRetrying, retryCountdown]);

  // Simulate connection loss at 30% of analyze stage
  useEffect(() => {
    if (!isUploading || completed) return;
    if (currentStage.key === "analyze" && stageProgress >= 30 && stageProgress < 35) {
      setConnectionLost(true);
      setIsRetrying(true);
      setRetryCountdown(4);
    }
  }, [currentStage.key, stageProgress, isUploading, completed]);

  const handleUpload = async (file: File) => {
    setError(null);

    if (!file.name.toLowerCase().endsWith(".zip")) {
      setSelectedFile(null);
      setError("That isn't a ZIP archive. Please choose a .zip file.");
      return;
    }

    try {
      setSelectedFile(file);
      setIsUploading(true);
      setConnectionLost(false);
      setCurrentStageIndex(0);
      setStageProgress(0);
      setCompleted(false);

      const analysisResponse = await createAnalysis();
      const newAnalysisId = analysisResponse.analysisId;
      setAnalysisId(newAnalysisId);

      await uploadRepository(newAnalysisId, file);

      toast.success("Upload complete", {
        position: "top-center",
        duration: 2000,
      });
    } catch (uploadError: unknown) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "Upload failed. Please try again.";

      setError(message);
      setIsUploading(false);
      setConnectionLost(false);
      setCurrentStageIndex(0);
      setStageProgress(0);
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

  const getStageState = (index: number): "complete" | "active" | "pending" | "error" => {
    if (completed) return "complete";
    if (connectionLost && STAGE_CONFIG[index].key === "analyze") return "error";
    if (currentStageIndex > index) return "complete";
    if (currentStageIndex === index) return "active";
    return "pending";
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Upload your repository
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Get an AI-powered analysis with rich insights in seconds.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
          {/* Header */}
          <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200">
                <FolderArchive size={22} strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-base font-bold tracking-tight text-slate-900">
                  Upload & Analyze Codebase
                </h2>
                <p className="text-sm text-slate-500">
                  Drop a ZIP and get AI-powered insights
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <input
              ref={inputRef}
              className="sr-only"
              id="repository-upload"
              type="file"
              accept=".zip,application/zip,application/x-zip-compressed"
              onChange={handleFileChange}
              disabled={isUploading}
            />

            <div
              aria-describedby="upload-help"
              className={`group relative flex min-h-72 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed px-6 py-10 text-center transition-all duration-300 ${
                isDragging
                  ? "scale-[1.01] border-indigo-500 bg-indigo-50 shadow-inner shadow-indigo-100"
                  : "border-slate-200 bg-slate-50/70 hover:border-indigo-300 hover:bg-indigo-50/40"
              } ${isUploading ? "cursor-wait opacity-80" : ""}`}
              role="button"
              tabIndex={isUploading ? -1 : 0}
              onClick={() => !isUploading && inputRef.current?.click()}
              onKeyDown={event => {
                if (!isUploading && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault();
                  inputRef.current?.click();
                }
              }}
              onDragEnter={event => {
                event.preventDefault();
                if (!isUploading) setIsDragging(true);
              }}
              onDragOver={event => event.preventDefault()}
              onDragLeave={event => {
                if (event.currentTarget === event.target) setIsDragging(false);
              }}
              onDrop={event => {
                event.preventDefault();
                setIsDragging(false);
                const file = event.dataTransfer.files[0];
                if (file && !isUploading) handleUpload(file);
              }}
            >
              <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

              <div
                className={`mb-5 flex h-20 w-20 items-center justify-center rounded-3xl transition-all duration-300 ${
                  isDragging
                    ? "scale-110 bg-indigo-600 text-white shadow-xl shadow-indigo-200"
                    : "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-100 group-hover:-translate-y-1 group-hover:shadow-md"
                }`}
              >
                <UploadCloud size={36} strokeWidth={1.8} />
              </div>

              {isUploading ? (
                <div className="w-full max-w-2xl">
                  {/* Status header */}
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800">
                      {connectionLost
                        ? "Connection lost"
                        : completed
                          ? "Analysis complete!"
                          : currentStage.label}
                    </p>
                    {connectionLost ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-bold text-rose-600">
                        <WifiOff size={13} /> Retrying in {retryCountdown}s
                      </span>
                    ) : completed ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-600">
                        <CheckCircle2 size={13} /> Done
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-600">
                        <RefreshCw className={currentStageIsActive ? "animate-spin" : ""} size={13} />
                        Processing...
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-200 ${
                        connectionLost
                          ? "bg-gradient-to-r from-rose-500 to-red-500"
                          : completed
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                            : currentStage.barClass
                      }`}
                      style={{ width: `${connectionLost ? Math.min(stageProgress, 60) : stageProgress}%` }}
                    />
                  </div>

                  {/* Stage indicators */}
                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-5">
                    {STAGE_CONFIG.map((stage, index) => {
                      const state = getStageState(index);
                      const isActive = state === "active";
                      const isComplete = state === "complete";
                      const isError = state === "error";

                      return (
                        <div
                          key={stage.key}
                          className={`relative flex items-center gap-3 rounded-2xl border p-3.5 transition-all duration-200 ${
                            isActive
                              ? "border-indigo-200 bg-indigo-50/50 shadow-sm"
                              : isComplete
                                ? "border-emerald-200 bg-emerald-50/60"
                                : isError
                                  ? "border-rose-200 bg-rose-50 animate-pulse"
                                  : "border-slate-100 bg-slate-50/50"
                          }`}
                        >
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${
                              isComplete
                                ? "bg-emerald-500 text-white"
                                : isError
                                  ? "bg-rose-500 text-white"
                                  : isActive
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                    : "bg-white text-slate-400 ring-1 ring-slate-200"
                            }`}
                          >
                            {isComplete ? (
                              <CheckCircle2 size={20} />
                            ) : isError ? (
                              <AlertCircle size={20} />
                            ) : (
                              <stage.icon size={20} />
                            )}
                          </div>
                          <div className="min-w-0 flex-1 text-left">
                            <p className="truncate text-sm font-bold text-slate-800">
                              {stage.label}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {isError ? "Check your connection" : stage.description}
                            </p>
                          </div>
                          <div className="ml-auto text-right">
                            {isActive && !isError && (
                              <span className="text-[11px] font-semibold text-indigo-500">
                                {stageProgress}%
                              </span>
                            )}
                            {isComplete && (
                              <span className="text-[11px] font-semibold text-emerald-600">
                                Done
                              </span>
                            )}
                            {isError && (
                              <button
                                type="button"
                                onClick={() => {
                                  setConnectionLost(false);
                                  setIsRetrying(true);
                                  setRetryCountdown(6);
                                }}
                                className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-rose-600 shadow-sm ring-1 ring-rose-200 transition hover:bg-rose-600 hover:text-white"
                              >
                                <RefreshCw size={12} />
                                Retry
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-lg font-semibold text-slate-900">
                    {isDragging ? "Drop your archive to upload" : "Drag & drop your ZIP here"}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    or click anywhere in this area to browse
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-transform group-hover:-translate-y-0.5">
                    <UploadCloud size={17} /> Choose ZIP file
                  </span>
                  <p
                    id="upload-help"
                    className="mt-4 text-center text-xs text-slate-400"
                  >
                    ZIP archives only. Keep your repository structure for best results.
                  </p>
                </>
              )}
            </div>

            {/* Selected file indicator */}
            {selectedFile && !isUploading && !error && (
              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                  <FileArchive size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-emerald-950">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-emerald-700">
                    {formatFileSize(selectedFile.size)} · ZIP archive ready
                  </p>
                </div>
                <CheckCircle2 className="shrink-0 text-emerald-500" size={20} />
              </div>
            )}

            {error && (
              <div
                className="mt-5 flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3.5 text-left"
                role="alert"
              >
                <AlertCircle className="mt-0.5 shrink-0 text-rose-500" size={20} />
                <div>
                  <p className="text-sm font-semibold text-rose-950">
                    Upload couldn't start
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