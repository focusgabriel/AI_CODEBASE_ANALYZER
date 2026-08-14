export interface AnalysisProps {
  userId: string,
  name: string,
  status: string,
  sourceLocation: string,
  reportId: string,
  startedAt: Date,
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date,
}

export interface MetricsProps {
  analysisId: string
  blankLines: number,
  classes: number,
  codeLines: number
  commentLines: number
  exports: number
  interfaces: number
  totalLines: number
  createdAt: Date
  updatedAt: Date
}

interface architectureProps{
  overview: string,
  patterns: string[],
  concerns: string[]
}

interface codeQualityProps {
  strengths: string[],
  weakness: string[],
}

// interface scoresProps {
//   architecture: number,
//   codeQuality: number,
//   technologies: number,
//   security: number,
//   overall: number,
// }

interface scoresProps {
  overall: number;
  [metricName: string]: number;
}

interface SecurityObjects {
  findings: string[],
  recommendations: string[]
}

interface SecurityMap {
  securities: SecurityObjects;
}
export interface ReportsProps {
  analysisId: string,
  userId: string,
  architecture: architectureProps,
  codeQuality: codeQualityProps,
  risks: string[],
  scores: scoresProps,
  security: SecurityMap
}