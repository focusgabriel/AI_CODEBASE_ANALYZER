import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import refreshClient from "../api/fetch";
import { AuthContext, type User } from "../lib/AuthContext";

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const { data } = await refreshClient.get("/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  // Check auth when app loads
  useEffect(() => {
    checkAuth();
  }, []);

  // Listen for automatic logout events from the interceptor
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      navigate("/", { replace: true });
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