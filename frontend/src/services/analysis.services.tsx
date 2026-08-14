/** @format */

import api from "../api/fetch";

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
) {
  const formData = new FormData();

  formData.append("repository", file);

  const response = await api.post(`/analyses/${analysisId}/upload`, formData, {
    withCredentials: true,
  });

  return response.data
}