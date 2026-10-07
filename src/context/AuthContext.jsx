import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(() =>
    localStorage.getItem("hashnode_token")
  );

  const [status, setStatus] = useState("loading");

  // Check existing login when the application starts
  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setStatus("guest");
        return;
      }

      try {
        const { data } = await api.get("/auth/me");

        setUser(data.user);
        setStatus("authenticated");
      } catch (error) {
        console.error("Authentication check failed:", error);

        localStorage.removeItem("hashnode_token");

        setToken(null);
        setUser(null);
        setStatus("guest");
      }
    };

    bootstrap();
  }, [token]);

  // Login
  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);

    localStorage.setItem("hashnode_token", data.token);

    setToken(data.token);
    setUser(data.user);
    setStatus("authenticated");

    return data;
  };

  // Register
  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);

    return data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("hashnode_token");

    setToken(null);
    setUser(null);
    setStatus("guest");
  };

  const value = useMemo(
    () => ({
      user,
      token,
      status,
      login,
      register,
      logout,
      setUser,
    }),
    [user, token, status]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}