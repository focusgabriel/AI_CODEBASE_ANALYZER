/** @format */

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/fetch";

interface FileMetrics {
  totalLines: number;
  codeLines: number;
  commentLines: number;
  blankLines: number;
  imports: number;
  exports: number;
  functions: number;
  classes: number;
  interfaces: number;
}

interface RepositoryFile {
  fileId: string;
  path: string;
  name: string;
  extension: string;
  language?: string;
}

interface FolderNode {
  name: string;
  path: string;
  folders: FolderNode[];
  files: RepositoryFile[];
}

interface RepositoryFileContent {
  _id: string;
  analysisId: string;
  path: string;
  name: string;
  extension: string;
  language?: string;
  content: string;
}

export default function CodebaseExplorer() {
  const { analysisId } = useParams<{ analysisId: string }>();

  const [files, setFiles] = useState<RepositoryFile[]>([]);

  const [selectedFile, setSelectedFile] = useState<RepositoryFile | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [fileContent, setFileContent] = useState<RepositoryFileContent | null>(
    null,
  );

  const [fileLoading, setFileLoading] = useState(false);

  const [fileMetrics, setFileMetrics] = useState<FileMetrics | null>(null);

  const [metricsLoading, setMetricsLoading] = useState(false);

  useEffect(() => {
    if (!analysisId) return;

    async function loadFiles() {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(
          `/metrics/analyses/${analysisId}/explorer`,
        );

        setFiles(response.data.data ?? []);
      } catch (error) {
        console.error("Failed to load repository files:", error);

        setError("Unable to load repository files.");
      } finally {
        setLoading(false);
      }
    }

    loadFiles();
  }, [analysisId]);

  const tree = useMemo(() => buildFileTree(files), [files]);

  if (loading) {
    return <ExplorerSkeleton />;
  }

  async function handleSelectFile(file: RepositoryFile) {
    try {
      setSelectedFile(file);

      setFileLoading(true);
      setMetricsLoading(true);

      setFileLoading(true);
      setMetricsLoading(true);

      setFileContent(null);
      setFileMetrics(null);

      const [fileResponse, metricsResponse] = await Promise.all([
        api.get(`files/analyses/${analysisId}/files/${file.fileId}`),

        api.get(`files/analyses/${analysisId}/files/${file.fileId}/metrics`),
      ]);

      setFileContent(fileResponse.data.data);

      setFileMetrics(metricsResponse.data.data);
    } catch (error) {
      console.error("Failed to load file information:", error);
    } finally {
      setFileLoading(false);
      setMetricsLoading(false);
    }
  }

  if (error) {
    return (
      <main className="p-6">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <h2 className="font-semibold text-red-700">Codebase Explorer</h2>

          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-6 p-6">
      {/* HEADER */}

      <section>
        <p className="text-sm text-[#777791]">Repository</p>

        <h1 className="mt-1 text-2xl font-semibold text-[#202033]">
          Codebase Explorer
        </h1>

        <p className="mt-2 text-sm text-[#777791]">
          Explore the files and structure of this analyzed repository.
        </p>
      </section>

      {/* EXPLORER */}

      <section className="grid min-h-[650px] grid-cols-1 overflow-hidden rounded-2xl border border-[#ECECF4] bg-white lg:grid-cols-[340px_1fr]">
        {/* FILE TREE */}

        <aside className="border-b border-[#ECECF4] bg-[#FAFAFC] lg:border-b-0 lg:border-r">
          <div className="border-b border-[#ECECF4] px-5 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#202033]">Files</h2>

              <span className="rounded-full bg-[#F0EDFF] px-2.5 py-1 text-xs font-medium text-[#7C3AED]">
                {files.length}
              </span>
            </div>
          </div>

          <div className="max-h-[600px] overflow-y-auto p-3">
            {tree.folders.map(folder => (
              <Folder
                key={folder.path}
                folder={folder}
                selectedFileId={selectedFile?.fileId}
                onSelectFile={setSelectedFile}
              />
            ))}

            {tree.files.map(file => (
              <FileItem
                key={file.fileId}
                file={file}
                selected={selectedFile?.fileId === file.fileId}
                onClick={() => handleSelectFile(file)}
              />
            ))}
          </div>
        </aside>

        {/* FILE DETAILS */}

        {metricsLoading ? (
          <FileMetricsSkeleton />
        ) : fileMetrics ? (
          <FileMetricsPanel metrics={fileMetrics} />
        ) : null}

        <section className="min-w-0">
          {selectedFile ? (
            <FileDetails
              file={selectedFile}
              content={fileContent}
              loading={fileLoading}
            />
          ) : (
            <EmptyFileState />
          )}
        </section>
      </section>
    </main>
  );
}

/* -------------------------------- */
/* FOLDER */
/* -------------------------------- */

function Folder({
  folder,
  selectedFileId,
  onSelectFile,
}: {
  folder: FolderNode;
  selectedFileId?: string;
  onSelectFile: (file: RepositoryFile) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-[#44445A] hover:bg-[#F0EDFF]"
      >
        <span className="w-4 text-xs">{open ? "⌄" : "›"}</span>

        <span>{open ? "📂" : "📁"}</span>

        <span className="truncate font-medium">{folder.name}</span>
      </button>

      {open && (
        <div className="ml-4 border-l border-[#E8E6EF] pl-2">
          {folder.folders.map(child => (
            <Folder
              key={child.path}
              folder={child}
              selectedFileId={selectedFileId}
              onSelectFile={onSelectFile}
            />
          ))}

          {folder.files.map(file => (
            <FileItem
              key={file.fileId}
              file={file}
              selected={selectedFileId === file.fileId}
              onClick={() => onSelectFile(file)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------- */
/* FILE ITEM */
/* -------------------------------- */

function FileMetricsPanel({ metrics }: { metrics: FileMetrics }) {
  const items = [
    {
      label: "Lines",
      value: metrics.totalLines,
    },
    {
      label: "Code",
      value: metrics.codeLines,
    },
    {
      label: "Comments",
      value: metrics.commentLines,
    },
    {
      label: "Imports",
      value: metrics.imports,
    },
    {
      label: "Exports",
      value: metrics.exports,
    },
    {
      label: "Functions",
      value: metrics.functions,
    },
    {
      label: "Classes",
      value: metrics.classes,
    },
    {
      label: "Interfaces",
      value: metrics.interfaces,
    },
  ];

  return (
    <div className="border-b border-[#ECECF4] p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[#202033]">File Metrics</h3>

        <p className="mt-1 text-xs text-[#9999AA]">
          Metrics calculated specifically for this file.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map(item => (
          <div key={item.label} className="rounded-xl bg-[#FAFAFC] p-3">
            <p className="text-xs text-[#9999AA]">{item.label}</p>

            <p className="mt-1 text-lg font-semibold text-[#202033]">
              {item.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FileMetricsSkeleton() {
  return (
    <div className="border-b border-[#ECECF4] p-6">
      <div className="h-4 w-24 animate-pulse rounded bg-[#ECECF4]" />

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({
          length: 8,
        }).map((_, index) => (
          <div
            key={index}
            className="h-16 animate-pulse rounded-xl bg-[#F0EFF4]"
          />
        ))}
      </div>
    </div>
  );
}

function FileItem({
  file,
  selected,
  onClick,
}: {
  file: RepositoryFile;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
        selected
          ? "bg-[#EEE9FF] text-[#6D28D9]"
          : "text-[#55556A] hover:bg-[#F4F3F8]"
      }`}
    >
      <span className="w-4 text-center">{getFileIcon(file.extension)}</span>

      <span className="truncate">{file.name}</span>
    </button>
  );
}

/* -------------------------------- */
/* FILE DETAILS */
/* -------------------------------- */

function FileDetails({
  file,
  content,
  loading,
}: {
  file: RepositoryFile;
  content: RepositoryFileContent | null;
  loading: boolean;
}) {
  return (
    <div className="flex h-full min-h-[650px] flex-col">
      <header className="border-b border-[#ECECF4] px-6 py-5">
        <p className="text-xs text-[#9999AA]">{file.path}</p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold text-[#202033]">{file.name}</h2>

          <span className="rounded-full bg-[#F3F1F8] px-2.5 py-1 text-xs text-[#66667A]">
            {file.extension || "file"}
          </span>

          {file.language && (
            <span className="rounded-full bg-[#F0EDFF] px-2.5 py-1 text-xs font-medium text-[#7C3AED]">
              {file.language}
            </span>
          )}
        </div>
      </header>

      <div className="border-b border-[#ECECF4] px-6 py-4">
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <span className="text-[#9999AA]">Path</span>

            <p className="mt-1 font-medium text-[#333346]">{file.path}</p>
          </div>

          <div>
            <span className="text-[#9999AA]">Language</span>

            <p className="mt-1 font-medium text-[#333346]">
              {file.language ?? "Unknown"}
            </p>
          </div>
        </div>
      </div>

      {/* SOURCE */}

      <div className="min-h-0 flex-1 overflow-hidden">
        {loading ? (
          <div className="p-6">
            <div className="h-4 w-1/3 animate-pulse rounded bg-[#ECECF4]" />

            <div className="mt-4 space-y-3">
              {Array.from({
                length: 15,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-3 animate-pulse rounded bg-[#F0EFF4]"
                  style={{
                    width: `${60 + (index % 4) * 10}%`,
                  }}
                />
              ))}
            </div>
          </div>
        ) : content ? (
          <div className="h-full overflow-auto bg-[#171720]">
            <pre className="min-w-max p-6 font-mono text-[13px] leading-6 text-[#E5E5EA]">
              {content.content?.split("\n").map((line, index) => (
                <div key={index} className="flex">
                  <span className="mr-6 inline-block w-10 select-none text-right text-[#686879]">
                    {index + 1}
                  </span>

                  <code>{line || "\u00A0"}</code>
                </div>
              ))}
            </pre>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-[#9999AA]">
              Unable to load file content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------- */
/* EMPTY STATE */
/* -------------------------------- */

function EmptyFileState() {
  return (
    <div className="flex h-full min-h-[500px] items-center justify-center p-8">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0EDFF] text-2xl">
          📄
        </div>

        <h2 className="mt-4 text-lg font-semibold text-[#202033]">
          Select a file
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#777791]">
          Choose a file from the repository tree to inspect its details and
          analysis.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------- */
/* INFO CARD */
/* -------------------------------- */

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#ECECF4] bg-white p-4">
      <p className="text-xs text-[#9999AA]">{label}</p>

      <p className="mt-2 truncate text-sm font-medium text-[#333346]">
        {value}
      </p>
    </div>
  );
}

/* -------------------------------- */
/* TREE BUILDER */
/* -------------------------------- */

function buildFileTree(files: RepositoryFile[]): FolderNode {
  const root: FolderNode = {
    name: "root",
    path: "",
    folders: [],
    files: [],
  };

  for (const file of files) {
    const parts = file.path.split("/").filter(Boolean);

    let current = root;
    let currentPath = "";

    for (let index = 0; index < parts.length - 1; index++) {
      const folderName = parts[index];

      currentPath = currentPath ? `${currentPath}/${folderName}` : folderName;

      let folder = current.folders.find(item => item.name === folderName);

      if (!folder) {
        folder = {
          name: folderName,
          path: currentPath,
          folders: [],
          files: [],
        };

        current.folders.push(folder);
      }

      current = folder;
    }

    current.files.push(file);
  }

  sortTree(root);

  return root;
}

/* -------------------------------- */
/* TREE SORT */
/* -------------------------------- */

function sortTree(node: FolderNode) {
  node.folders.sort((a, b) => a.name.localeCompare(b.name));

  node.files.sort((a, b) => a.name?.localeCompare(b.name));

  node.folders.forEach(sortTree);
}

/* -------------------------------- */
/* FILE ICON */
/* -------------------------------- */

function getFileIcon(extension: string) {
  switch (extension.toLowerCase()) {
    case ".ts":
    case ".tsx":
      return "🔷";

    case ".js":
    case ".jsx":
      return "🟨";

    case ".json":
      return "⚙️";

    case ".css":
    case ".scss":
      return "🎨";

    case ".html":
      return "🌐";

    case ".md":
      return "📝";

    case ".py":
      return "🐍";

    default:
      return "📄";
  }
}

/* -------------------------------- */
/* LOADING */
/* -------------------------------- */

function ExplorerSkeleton() {
  return (
    <main className="space-y-6 p-6">
      <div className="h-16 animate-pulse rounded-2xl bg-[#ECECF4]" />

      <div className="grid min-h-[650px] grid-cols-1 animate-pulse rounded-2xl bg-[#ECECF4] lg:grid-cols-[340px_1fr]" />
    </main>
  );
}
