import

const API_URL = import.meta.env.VITE_API_URL || "";
 { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
    setAuthLoading(false);
  }, []);
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || data.message || "Login failed");
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || data.message || "Registration failed");
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  const logout = () => {
    fetch(`${API_URL}/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
    localStorage.removeItem("user");
    setUser(null);
  };
  const loginWithToken = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };
  return (
    <AuthContext.Provider
      value={{ user, authLoading, login, register, logout, loginWithToken, isAdmin: user?.role === "admin" }}
    >
      {children}
    </AuthContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
