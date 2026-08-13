/** @format */

import { Route, Routes, useLocation } from "react-router-dom";
import PublicRoute from "./components/PublicRoutes";
import LandingPage from "./pages/LandingPage";
import Register from "./auth/register";
import Login from "./auth/login";
import ProtectedRoute from "./components/ProtectedRoutes";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import { PUBLIC_ROUTES } from "./constants";
import SideBar from "./components/SideBar";
import Header from "./components/Header";

const App = () => {
  const location = useLocation();
  const isAuthRoute = PUBLIC_ROUTES.some(
    r => location.pathname === r || location.pathname.startsWith(r + "/"),
  );

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
        </Routes>
      </main>
    </div>
  );
};

export default App;
