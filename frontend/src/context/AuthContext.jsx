import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================================
  // LOAD CURRENT USER
  // ==========================================================

  const loadUser = async () => {
    const token = localStorage.getItem("campuslaunch_token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/me");

      setUser(response.data.user || response.data);
    } catch (error) {
      console.error("Failed to load user:", error);

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem("campuslaunch_token");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL AUTH CHECK
  // ==========================================================

  useEffect(() => {
    loadUser();
  }, []);

  // ==========================================================
  // LOGIN
  // ==========================================================

  const login = async (email, password, expectedRole = undefined) => {
    const payload = {
      email: email.trim().toLowerCase(),
      password,
    };

    if (expectedRole) {
      payload.expectedRole = expectedRole;
    }

    const response = await api.post("/auth/login", payload);

    const token = response.data?.token;

    if (!token) {
      throw new Error(
        "Login succeeded but no authentication token was returned."
      );
    }

    localStorage.setItem("campuslaunch_token", token);

    const loggedInUser = response.data?.user;

    setUser(loggedInUser);

    return loggedInUser;
  };

  // ==========================================================
  // REGISTER
  // ==========================================================

  const register = async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  };

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const logout = () => {
    localStorage.removeItem("campuslaunch_token");
    setUser(null);
  };

  // ==========================================================
  // CONTEXT
  // ==========================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ==========================================================
// HOOK
// ==========================================================

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;