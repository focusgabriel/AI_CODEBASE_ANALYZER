/** @format */

import { useEffect, useState } from "react";
import type { DashboardResponse } from "../types/dashboard";
import api from "../api/fetch";
import UploadRepository from "../pages/Upload";
import HowItWorks from "./HowItWorks";
import ScoreCircle from "./Score";
import AnalysisField from "./AnalysisField";
import OverallCodebaseScore from "./OverallCodebaseScore";
import CodeScores from "./CodeScores";
import ReportField from "./ReportField";

const Dashboard = () => {
  // const { id } = useParams();

  const [dashboardData, setDashboard] = useState<DashboardResponse | null>(
    null,
  );

  useEffect(() => {
    const getDashboard = async () => {

      const response = await api.get("/dashboard");

      setDashboard(response.data);
    };

    void getDashboard();
  }, []);

  return (
    <section className="px-2 pb-8">
      
      <div className="flex justify-between w-full border-5 border-amber-50">
          <UploadRepository />
          <HowItWorks />
          <AnalysisField />
          {/* <ScoreCircle score={70} /> */}
      </div>

      <div className="flex justify-between items-center gap-4 border mt-6 border-amber-300">
        <OverallCodebaseScore score={50} />
        <CodeScores />
      </div>

      <div className="flex justify-between items-center gap-4 border mt-6 border-amber-300">
        <ReportField />
      </div>
      
    </section>
  );
};

export default Dashboard;
