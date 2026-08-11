import type { PrioritizedSourceFile } from "./source-prioritization.services.js";

export interface SourceBudgetOptions {
  maxFiles: number;
  maxCharacters: number;
}

export function applySourceBudget(
  files: PrioritizedSourceFile[],
  options: SourceBudgetOptions,
): PrioritizedSourceFile[] {
  const selected: PrioritizedSourceFile[] = [];

  let totalCharacters = 0;

  for (const file of files) {
    if (selected.length >= options.maxFiles) {
      break;
    }

    const fileCharacters = file.content.length;

    if (
      totalCharacters + fileCharacters >
      options.maxCharacters
    ) {
      continue;
    }

    selected.push(file);

    totalCharacters += fileCharacters;
  }

  return selected;
}