
import api from "../api/fetch"

export const ExportPDF = async(analysisId: string) => {
  const response = await api.get(`/analyses/${analysisId}/export`, {
    responseType: "blob"
  });
  
  const url = window.URL.createObjectURL(
    new Blob([response.data], {
      type: "application/pdf",
    }),
  );

  const link = document.createElement("a");

  link.href = url;
  link.download = `analysis-report-${analysisId}.pdf`;

  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
}