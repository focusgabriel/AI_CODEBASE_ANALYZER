export interface ExportDto {
  analysisId: string,
  userId: string,
  architecture: {
    overview: string,
    patterns: string[],
    concerns: string[]
  },
  codeQuality: {
    strengths: string[],
    weaknesses: string[],
  } ,
  risks: string[],
  scores: {
    overall: number;
    architecture: number,
    codeQuality: number,
    technologies: number,
    security: number,
  },
  security: {
    findings: string[],
    recommendations: string[]
  },
  summary: string
  technologies: {
    strengths: string[],
    concerns: string[]
  }
}