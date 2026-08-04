import fs from "node:fs";
import path from "node:path";
import unzipper from "unzipper";

export async function extractZip(zipPath: string, destination: string) {
  await fs
    .createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: destination }))
    .promise();

  return destination;
}

// export async function extractZip(
//   zipPath: string,
//   destination: string,
// ) {
//   fs.mkdirSync(destination, { recursive: true });

//   await fs
//     .createReadStream(zipPath)
//     .pipe(unzipper.Extract({ path: destination }))
//     .promise();
// }
