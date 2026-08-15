import type { LlmAnalysisDto } from "../dtos/llm-analysis.dto.js";
import { validateLlmAnalysis } from "../utils/llm-analyis-validator.js";
import type { LlmAnalysisInput } from "./llm-analysis-input.services.js";
import type { LlmProvider } from "./llm-provider.services.js";

export async function analyzeWithLlm(
  input: LlmAnalysisInput,
  provider: LlmProvider,
): Promise<LlmAnalysisDto> {
  const prompt = buildAnalysisPrompt(input);

  const result = await provider.analyze(prompt);

  return validateLlmAnalysis(result);
}

function buildAnalysisPrompt(
  input: LlmAnalysisInput,
): string {
  return `
You are a senior software engineer reviewing a software repository.

Analyze ONLY the evidence provided.

Do not invent functionality, technologies,
architecture, vulnerabilities, or problems.

For each category, provide a score from 0 to 100.

Scoring criteria:

Architecture:
Evaluate structure, separation of concerns, modularity, maintainability,
design patterns, and overall organization.

Code Quality:
Evaluate readability, naming, duplication, error handling,
maintainability, consistency, and code correctness.

Technologies:
Evaluate technology choices, dependency health, appropriate usage
of frameworks/libraries, and whether the stack is reasonably modern
for the project's purpose.

Security:
Evaluate credentials/secrets, authentication/authorization,
input validation, dependency risks, unsafe patterns, and other
security concerns.

Rate the project on a scale of 0 to 100. return only numeric value

Do NOT calculate an overall score.
The backend will calculate the overall score.

Evaluate:

- architecture
- code quality
- technology choices
- security
- maintainability
- risks
- actionable recommendations

Return valid JSON matching this structure:

{
  "summary": "string",
  "architecture": {
    "overview": "string",
    "patterns": ["string"],
    "concerns": ["string"],
  },
  "codeQuality": {
    "strengths": ["string"],
    "weaknesses": ["string"]
  },
  "technologies": {
    "strengths": ["string"],
    "concerns": ["string"]
  },
  "security": {
    "findings": ["string"],
    "recommendations": ["string"]
  },
  "recommendations": ["string"],
  "risks": ["string"],
}


REPOSITORY:
${JSON.stringify(input.repository, null, 2)}

PACKAGES:
${JSON.stringify(input.packages, null, 2)}

SOURCE FILES:
${input.sourceFiles
      .map(
        (file) => `
FILE: ${file.path}
PRIORITY: ${file.priority}

${file.content}
`,
  )
  .join("\n")}
`;
}