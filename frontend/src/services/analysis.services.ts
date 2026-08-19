/** @format */

import { type AxiosProgressEvent } from "axios";
import api from "../api/fetch";
import type { Analysis } from "../types/dashboard";

export const createAnalysis = async () => {
  const response = await api.post(
    "/analyses",
    {},
    { withCredentials: true },
  );

  console.log("🔥 CREATE ANALYSIS RESPONSE:", response);
  return response.data.data;
};

export async function uploadRepository(
  analysisId: string,
  file: File,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
) {
  const formData = new FormData();

  formData.append("repository", file);

  const response = await api.post(`/analyses/${analysisId}/upload`, formData, {
    withCredentials: true,
    onUploadProgress,
  });

  return response.data
}

export type AnalysisBackendStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export async function getAnalysisStatus(analysisId: string) {
  const response = await api.get<{
    success: boolean;
    data: {
      name: string;
      status: AnalysisBackendStatus;
      reportId?: string;
      completedAt?: string;
      createdAt?: string;
    };
  }>(`/analyses/${analysisId}/`, { withCredentials: true });

  return response.data;
}

interface AnalysisQueryParams {
  name?: string;
  status?: string;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
  page: number;
  limit: number;
}

export interface PaginatedAnalysesResponse {
  getAnalysis: Analysis[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalLimit: number;
  };
}

export const AllAnalysisForUser = async (
  params: AnalysisQueryParams,
): Promise<PaginatedAnalysesResponse> => {
  const response = await api.get("/analyses", {
    // Axios only serializes query values placed under `params` for GET requests.
    params,
    withCredentials: true,
  });

  return response.data;
};
export async function renameAnalysis(
  analysisId: string,
  name: string,
) {
  const response = await api.patch(
    `/analyses/${analysisId}`,
    { name },
    { withCredentials: true },
  );

  return response.data;
}

export async function deleteAnalysis(
  analysisId: string,
) {
  const response = await api.delete(`/analyses/${analysisId}`, {
    withCredentials: true,
  });

  return response.data;
}
