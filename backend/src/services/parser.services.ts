import { parseSource } from "../utils/ats-parser.js";

export function parseFile(
  language: string,
  content: string,
) {
  return parseSource(content, language);
}