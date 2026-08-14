/** @format */

import { useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileArchive,
  FolderArchive,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import {
  createAnalysis,
  uploadRepository,
} from "../services/analysis.services";
// import { useNavigate } from "react-router-dom";

const UploadRepository = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // const navigate = useNavigate();

  const handleUpload = async (file: File) => {
    setError(null);

    if (!file.name.toLowerCase().endsWith(".zip")) {
      setSelectedFile(null);
      setError("That file isn’t a ZIP archive. Please choose a .zip file.");
      return;
    }

    try {
      setSelectedFile(file);
      setIsUploading(true);

      const analysisResponse = await createAnalysis();

      const analysisId = analysisResponse.analysisId;

      console.log(analysisId);


      await uploadRepository(analysisId, file);
      // if it succeeds then.
      // navigate(`/analysis/${analysisId}`);
    } catch (uploadError: any) {
      setError(
        uploadError?.response?.data?.message ??
          uploadError?.message ??
          "Upload failed. Please try again.",
      );
    } finally {
      setIsUploading(false);
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

  return (
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200">
            <FolderArchive size={27} strokeWidth={2.2} />
          </div>
          <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-700">
            <Sparkles size={14} /> Repository analysis
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Upload your codebase
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Drop in a ZIP archive and we’ll map your project, surface insights,
            and get your analysis ready.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/80 bg-white/85 p-4 shadow-[0_30px_80px_-35px_rgba(79,70,229,0.28)] backdrop-blur sm:p-6">
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
            className={`group relative flex min-h-80 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-dashed px-6 py-10 text-center transition-all duration-300 ${
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
            <div className="absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-indigo-200 to-transparent" />

            <div className={`mb-5 flex h-20 w-20 items-center justify-center rounded-3xl transition-all duration-300 ${isDragging ? "scale-110 bg-indigo-600 text-white shadow-xl shadow-indigo-200" : "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-100 group-hover:-translate-y-1 group-hover:shadow-md"}`}>
              <UploadCloud size={36} strokeWidth={1.8} />
            </div>

            {isUploading ? (
              <div className="w-full max-w-sm">
                <p className="text-lg font-semibold text-slate-900">Preparing your analysis</p>
                <p className="mt-1 text-sm text-slate-500">Uploading {selectedFile?.name}</p>
                <div className="mt-6 h-2 overflow-hidden rounded-full bg-indigo-100">
                  <div className="h-full w-2/3 animate-pulse rounded-full bg-linear-to-r from-indigo-500 to-violet-500" />
                </div>
              </div>
            ) : (
              <>
                <p className="text-lg font-semibold text-slate-900">
                  {isDragging ? "Drop your archive to upload" : "Drag & drop your ZIP here"}
                </p>
                <p className="mt-2 text-sm text-slate-500">or click anywhere in this area to browse</p>
                <span className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-transform group-hover:-translate-y-0.5">
                  <UploadCloud size={17} /> Choose ZIP file
                </span>
              </>
            )}
          </div>

          <p id="upload-help" className="mt-4 text-center text-xs text-slate-400">
            ZIP archives only. Keep your repository structure intact for the best results.
          </p>

          {selectedFile && !isUploading && !error && (
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <FileArchive size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-emerald-950">{selectedFile.name}</p>
                <p className="text-xs text-emerald-700">{formatFileSize(selectedFile.size)} · ZIP archive ready</p>
              </div>
              <CheckCircle2 className="shrink-0 text-emerald-500" size={20} />
            </div>
          )}

          {error && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3.5 text-left" role="alert">
              <AlertCircle className="mt-0.5 shrink-0 text-rose-500" size={20} />
              <div>
                <p className="text-sm font-semibold text-rose-950">Upload couldn’t start</p>
                <p className="mt-0.5 text-sm text-rose-700">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UploadRepository;
