import { GoogleGenAI } from "@google/genai";
import { LlmProvider } from "../services/llm-provider.services.js";
import { LlmAnalysisDto } from "../dtos/llm-analysis.dto.js";
import { validateLlmAnalysis } from "../utils/llm-analyis-validator.js";





const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


const responseSchema = {
  type: "object",
  properties: {
    summary: {
      type: "string",
    },

    scores: {
      type: "object",
      properties: {
        architecture: {
          type: "number",
        },
        codeQuality: {
          type: "number",
        },
        technologies: {
          type: "number",
        },
        security: {
          type: "number",
        },
      },
      required: [
        "architecture",
        "codeQuality",
        "technologies",
        "security",
      ],
    },

    architecture: {
      type: "object",
      properties: {
        overview: {
          type: "string",
        },
        patterns: {
          type: "array",
          items: {
            type: "string",
          },
        },
        concerns: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      required: [
        "overview",
        "patterns",
        "concerns",
      ],
    },

    codeQuality: {
      type: "object",
      properties: {
        strengths: {
          type: "array",
          items: {
            type: "string",
          },
        },
        weaknesses: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      required: [
        "strengths",
        "weaknesses",
      ],
    },

    technologies: {
      type: "object",
      properties: {
        strengths: {
          type: "array",
          items: {
            type: "string",
          },
        },
        concerns: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      required: [
        "strengths",
        "concerns",
      ],
    },

    security: {
      type: "object",
      properties: {
        findings: {
          type: "array",
          items: {
            type: "string",
          },
        },
        recommendations: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      required: [
        "findings",
        "recommendations",
      ],
    },

    recommendations: {
      type: "array",
      items: {
        type: "string",
      },
    },

    risks: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },

  required: [
    "summary",
    "architecture",
    "codeQuality",
    "technologies",
    "security",
    "recommendations",
    "risks",
  ],


};






async function sleep(ms: number): Promise<void> {

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms);
  })

}


async function retry<T>(
  operation: () => Promise<T>,
) {
  const MAXATTEMPTS = 3;
  let delay = 1000;

  for (let i = 0; i < MAXATTEMPTS; i++) {

    try {

      const result = await operation();

      console.log(`Operation succeeded on attempt ${i + 1} / ${MAXATTEMPTS}`);

      return result;

    } catch (error) {

      console.error(`Operation failed on attempt ${i + 1} / ${MAXATTEMPTS}:`, error);
      if (i !== MAXATTEMPTS - 1) {
        await sleep(delay);
        delay *= 2;
      } else {
        throw error;
      }

    }

  }
}


export class GeminiProvider implements LlmProvider {
  async analyze(
    prompt: string,
  ): Promise<LlmAnalysisDto> {
    try {
      const response = await retry(
        async () => {
          return ai.models.generateContent({
            model:
              process.env.GEMINI_MODEL ??
              "gemini-3.6-flash",

            contents: prompt,

            config: {
              responseMimeType: "application/json",
              responseSchema,
              temperature: 0.2,
            },
          });
        }
      )

      const output = response!.text;

      const parsedOutput = JSON.parse(output as string);

      console.log("🤖 PARSED GEMINI RESPONSE:");
      console.dir(parsedOutput, {
        depth: null,
      });

      return validateLlmAnalysis(parsedOutput);
    }
    catch (error: unknown) {
      console.error("❌ GEMINI REQUEST FAILED");
      console.error("RAW ERROR:", error);

      if (error instanceof Error) {
        console.error("NAME:", error.name);
        console.error("MESSAGE:", error.message);
        console.error("CAUSE:", error.cause);

        const cause = error.cause as
          | {
            code?: string;
            message?: string;
            errno?: number;
            syscall?: string;
            address?: string;
            port?: number;
          }
          | undefined;

        console.error("CAUSE DETAILS:", {
          code: cause?.code,
          message: cause?.message,
          errno: cause?.errno,
          syscall: cause?.syscall,
          address: cause?.address,
          port: cause?.port,
        });
      }

      throw error;
    }
  }
}