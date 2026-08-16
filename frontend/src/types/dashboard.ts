export interface UserProps {
  name: string,
  email: string,
}

export interface Analysis {
  _id: string,
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

export interface Metrics {
  analysisId: string
  blankLines: number,
  classes: number,
  codeLines: number,
  commentLines: number,
  exports: number,
  interfaces: number,
  totalLines: number,
  createdAt: Date,
  updatedAt: Date,
}

export interface Files {
  size: number[],
  language: string[]
}

export interface Uploads {
  originalFileName: string,
  analysisId: string,
  uploadId: string,
  createdAt: string

}


export interface Reports {
  analysisId: string,
  userId: string,
  architecture: {
    overview: string,
    patterns: string[],
    concerns: string[]
  },
  codeQuality: {
    strengths: string[],
    weakness: string[],
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

export interface ScoreTrendItem {
  analysisId: string;
  score: number;
  date: string;
}

export interface ScoreTrend {
  trend: ScoreTrendItem[];
  highestScore: number;
  lowestScore: number;
  averageScore: number;
}

export interface DashboardResponse {
  authUser: UserProps,
  getAnalysis: Analysis[],
  metrics: Metrics[],
  File: Files,
  Uploads: Uploads[],
  reports: Reports[],
  scoreTrend: ScoreTrend;
}
