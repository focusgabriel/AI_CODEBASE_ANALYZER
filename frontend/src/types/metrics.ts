export interface RepositoryMetrics {
  _id: string;
  analysisId: string;

  totalLines: number;
  codeLines: number;
  commentLines: number;
  blankLines: number;

  imports: number;
  exports: number;
  functions: number;
  classes: number;
  interfaces: number;

  createdAt: string;
  updatedAt: string;
}

export interface MetricsResponse {
  success: boolean;
  metrics: RepositoryMetrics;
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

export interface ScoreTrendResponse {
  success: boolean;
  data: ScoreTrend;
}