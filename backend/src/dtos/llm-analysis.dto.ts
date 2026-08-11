export interface LlmAnalysisDto {
  summary: string;

  scores: {
    architecture: number,
    codeQuality: number,
    technologies: number,
    security: number,
    // overall: number,
  }

  architecture: {
    overview: string;
    patterns: string[];
    concerns: string[];
  };

  codeQuality: {
    strengths: string[];
    weaknesses: string[];
  };

  technologies: {
    strengths: string[];
    concerns: string[];
  };

  security: {
    findings: string[];
    recommendations: string[];
  };

  recommendations: string[];

  risks: string[];
}