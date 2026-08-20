/** @format */

import { Route, Routes, useLocation } from "react-router-dom";
import PublicRoute from "./components/PublicRoutes";
import LandingPage from "./pages/LandingPage";
import Register from "./auth/register";
import Login from "./auth/login";
import ProtectedRoute from "./components/ProtectedRoutes";
import Dashboard from "./components/Dashboard";
import { Toaster } from "react-hot-toast";
import { PUBLIC_ROUTES } from "./constants";
import SideBar from "./components/SideBar";
import Header from "./components/Header";
import AnalyticsPage from "./pages/AnalyticsPage";
import api from "./api/fetch";
import { useEffect, useState } from "react";
import type { DashboardResponse } from "./types/dashboard";
import UploadPage from "./pages/UploadPage";
import ReportPage from "./pages/ReportPage";
import Metrics from "./pages/MetricsPage";
import AnalysisOverview from "./pages/AnalysisOverview";
import Logout from "./auth/Logout";
import VerifyEmail from "./pages/verifyEmail";
import NewPassword from "./auth/NewPassword";
import ForgotPassword from "./auth/ForgotPassword";

const App = () => {
  const location = useLocation();
  const isAuthRoute = PUBLIC_ROUTES.some(
    r => location.pathname === r || location.pathname.startsWith(r + "/"),
  );

  const [dashboardData, setDashboard] = useState<DashboardResponse | null>(
    null,
  );
  const [analysis, setAnalysis] = useState([]);

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const response = await api.get("/dashboard");
        const res = await api.get("/analyses");
        setAnalysis(res.data.getAnalysis);
        setDashboard(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    void getDashboard();
  }, [analysis]);

  // useEffect(() => {
  //   const getAnalysisId = async () => {
  //     try {
  //       const response = await api.get("/analyses");

  //       setAnalysis(response.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   void getAnalysisId;
  // }, [analysis]);

  const analysisId = analysis.map(item => item._id);
  const getOneAnalysisId = analysisId.map(item => item);
  // console.log(getOneAnalysisId[0])

  return (
    <div
      className={
        isAuthRoute
          ? "min-h-screen bg-slate-50"
          : "flex h-screen overflow-hidden bg-slate-50 w-full"
      }
    >
      <Toaster position="top-right" />
      {!isAuthRoute && <SideBar />}
      <main
        className={
          isAuthRoute
            ? "min-h-screen w-full"
            : "main-with-bottom-sidebar h-full w-full flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 lg:pl-16"
        }
      >
        {!isAuthRoute && <Header />}
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/overview"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ReportPage
                  reports={dashboardData?.reports}
                  getAnalysis={dashboardData?.getAnalysis}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analyses/:analysisId"
            element={
              <ProtectedRoute>
                <AnalysisOverview />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/analyses/:analysisId/explorer"
            element={
              <ProtectedRoute>
                <CodebaseExplorer />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/metrics"
            element={
              <ProtectedRoute>
                <Metrics
                  getAnalysis={dashboardData?.getAnalysis}
                  initialAnalysisId={`6a84608af0f61fc1eb157a6b`}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analyses"
            element={
              <ProtectedRoute>
                <AnalyticsPage
                  // getAnalysis={dashboardData?.getAnalysis}
                  scoreTrend={
                    dashboardData?.scoreTrend ?? {
                      trend: [],
                      highestScore: 0,
                      lowestScore: 0,
                      averageScore: 0,
                    }
                  }
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/logout"
            element={
              <ProtectedRoute>
                <Logout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/verify-email/:token"
            element={
              <PublicRoute>
                <VerifyEmail />
              </PublicRoute>
            }
          />

          <Route
            path="/reset-password/:token"
            element={
              <PublicRoute>
                <NewPassword />
              </PublicRoute>
            }
          />

          <Route
            path="/forgotPassword"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />

        </Routes>
      </main>
    </div>
  );
};

export default App;
