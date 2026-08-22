/** @format */

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/fetch";
import { AuthContext, type User } from "../lib/AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async (signal?: AbortSignal) => {
    try {
      const { data } = await api.get("/auth/me", { signal });
      setUser(data.user);
    } catch {
      if (signal?.aborted) return;
      setUser(null);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Even if the server call fails, clear local state
    } finally {
      setUser(null);
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Check auth when app loads
  useEffect(() => {
    const controller = new AbortController();

    void checkAuth(controller.signal);

    return () => {
      controller.abort();
    };
  }, [checkAuth]);

  // Listen for automatic logout events from the interceptor
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      navigate("/login", { replace: true });
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        checkAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
