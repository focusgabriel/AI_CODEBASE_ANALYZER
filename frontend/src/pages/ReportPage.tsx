/** @format */

import { useEffect, useState } from "react";
import api from "../api/fetch";
import ReportField from "../components/ReportField";
import type { DashboardResponse } from "../types/dashboard";

const ReportPage = () => {
  const [dashboardData, setDashboard] = useState<DashboardResponse | null>(
    null,
  );

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const response = await api.get("/dashboard");
        setDashboard(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    void getDashboard();
  }, []);

  // const reports = dashboardData?.reports ?? [];

  return (
    <div>
      <ReportField reports={dashboardData?.reports} getAnalysis={dashboardData?.getAnalysis} />
    </div>
  );
};

export default ReportPage;
