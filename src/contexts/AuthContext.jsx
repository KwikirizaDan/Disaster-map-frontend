import React, { createContext, useContext, useState, useEffect } from "react";

// =========================
// Auth Context Setup
// =========================

// Create a context for authentication
const AuthContext = createContext(null);

// Custom hook to access authentication context
export const useAuth = () => useContext(AuthContext);

// Base API URL (centralized in case it changes later)
const API_BASE = "http://127.0.0.1:5000";

// =========================
// Auth Provider
// =========================
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds current user info
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Login state
  const [loading, setLoading] = useState(true); // Loading indicator

  // -------------------------
  // Check for active session (on mount)
  // -------------------------
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${API_BASE}/auth/profile`, {
          // If using sessions/cookies:
          credentials: "include",
          // If using JWT:
          // headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // -------------------------
  // Register a new user
  // -------------------------
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to register");

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Login user
  // -------------------------
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // keep this if using sessions
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to login");

      // If backend returns a JWT:
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Fetch profile after login
      const profileResponse = await fetch(`${API_BASE}/auth/profile`, {
        credentials: "include", // For sessions
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // For JWT
        },
      });

      if (!profileResponse.ok) {
        throw new Error("Failed to fetch profile after login.");
      }

      const userData = await profileResponse.json();
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Logout user
  // -------------------------
  const logout = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      // Clear local storage if using JWT
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Clear local state no matter what
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  // -------------------------
  // Verify Email
  // -------------------------
  const verifyEmail = async (code) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/verify-email/${code}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to verify email");

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Role Helpers
  // -------------------------
  const isAdmin = () => user?.role === "admin";
  const isReporter = () => user?.role === "reporter";

  // -------------------------
  // Disaster CRUD
  // -------------------------
  const createDisaster = async (disasterData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/disasters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(disasterData),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create disaster");

      return { success: true, message: data.message, disaster: data.disaster };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateDisaster = async (id, disasterData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/disasters/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(disasterData),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update disaster");

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteDisaster = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/disasters/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete disaster");

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Context Value
  // -------------------------
  const value = {
    user,
    isAuthenticated,
    loading,
    register,
    login,
    logout,
    verifyEmail,
    isAdmin,
    isReporter,
    createDisaster,
    updateDisaster,
    deleteDisaster,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
