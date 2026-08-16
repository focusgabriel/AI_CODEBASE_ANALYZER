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
import ReportPage from "./pages/ReportPage";
import Analytics from "./pages/AnalyticsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import api from "./api/fetch";
import { useEffect, useState } from "react";
import type { DashboardResponse } from "./types/dashboard";
import UploadRepository from "./pages/Upload";
import UploadPage from "./pages/uploadPage";

const App = () => {
  const location = useLocation();
  const isAuthRoute = PUBLIC_ROUTES.some(
    r => location.pathname === r || location.pathname.startsWith(r + "/"),
  );

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

  const reports = dashboardData?.reports ?? [];

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
                <ReportPage />
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
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsPage
                  getAnalysis={dashboardData?.getAnalysis}
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
        </Routes>
      </main>
    </div>
  );
};

export default App;
