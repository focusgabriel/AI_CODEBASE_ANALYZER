import type { AnalysisProps, MetricsProps, ReportsProps } from "../constants/dashboard";

export interface UserProps {
  name: string,
  email: string,
}

export interface Analysis {
  analysis: AnalysisProps[]
}

export interface Metrics {
  reports: MetricsProps[]
}

export interface Files {
  size: number,
  language: string
}

export interface Uploads {
  originalFileName: string,
  analysisId: string,
  uploadId: string,
  createdAt: string

}

export interface Reports {
  analysisReports: ReportsProps[];
}