import fs from "node:fs";
import path from "node:path";
import unzipper from "unzipper";

const IGNORED_DIRECTORIES = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "coverage",
  ".cache",
  ".turbo",
  "out",
]);

function shouldIgnore(filePath: string): boolean {
  const parts = filePath.split(/[\\/]+/);

  return parts.some((part) =>
    IGNORED_DIRECTORIES.has(part),
  );
}

export async function extractZip(
  zipPath: string,
  destination: string,
) {
  await fs.promises.mkdir(destination, {
    recursive: true,
  });

  const directory = await unzipper.Open.file(zipPath);

  const destinationRoot = path.resolve(destination);

  for (const entry of directory.files) {
    const entryPath = entry.path;

    // Skip unwanted directories/files.
    if (shouldIgnore(entryPath)) {
      continue;
    }

    // Prevent ZIP path traversal.
    const outputPath = path.resolve(
      destinationRoot,
      entryPath,
    );

    if (
      outputPath !== destinationRoot &&
      !outputPath.startsWith(destinationRoot + path.sep)
    ) {
      throw new Error(
        `Unsafe ZIP entry detected: ${entryPath}`,
      );
    }

    if (entry.type === "Directory") {
      await fs.promises.mkdir(outputPath, {
        recursive: true,
      });

      continue;
    }

    await fs.promises.mkdir(
      path.dirname(outputPath),
      { recursive: true },
    );

    await new Promise<void>((resolve, reject) => {
      entry
        .stream()
        .pipe(fs.createWriteStream(outputPath))
        .on("finish", resolve)
        .on("error", reject);
    });
  }

  return destination;
}