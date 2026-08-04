import fs from "node:fs/promises";
import path from "node:path";

export interface ScannedFile {
  path: string;
  extension: string;
  size: number;
}

export async function scanDirectory(directory: string): Promise<ScannedFile[]> {
  const entries = await fs.readdir(directory, {
    withFileTypes: true,
  });

  const files: ScannedFile[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await scanDirectory(fullPath)));
    } else {
      const stat = await fs.stat(fullPath);

      files.push({
        path: fullPath,
        extension: path.extname(fullPath),
        size: stat.size,
      });
    }
  }

  return files;
}

// import fs from "node:fs/promises";
// import path from "node:path";

// export async function scanDirectory(directory: string): Promise<string[]> {
//   const entries = await fs.readdir(directory, { withFileTypes: true });

//   let files: string[] = [];

//   for (const entry of entries) {
//     const fullPath = path.join(directory, entry.name);

//     if (entry.isDirectory()) {
//       files.push(...await scanDirectory(fullPath));
//     } else {
//       files.push(fullPath);
//     }
//   }

//   return files;
// }
