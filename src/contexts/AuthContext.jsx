import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const API_BASE = "http://127.0.0.1:5000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/auth/profile`, {
          method: "GET",
          headers: getAuthHeaders(),
          credentials: "include", // Important for cookies/sessions
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsAuthenticated(true);
        } else if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("authToken");
          console.log("Token invalid, requiring re-login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("authToken");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Register user - FIXED with credentials: "include"
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        credentials: "include", // CRITICAL FIX - Add this line
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { 
          success: false, 
          message: data.message || `Failed to register (Status: ${response.status})` 
        };
      }

      return { 
        success: true, 
        message: data.message || "Registration successful",
        user: data.user // If your backend returns user data
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || "Network error during registration" 
      };
    } finally {
      setLoading(false);
    }
  };

  // Login user - FIXED with credentials: "include"
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        credentials: "include", // CRITICAL FIX - Add this line
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to login (Status: ${response.status})`);
      }

      // Store the JWT token if using JWT
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      
      // Set user data from response
      setUser(data.user || { email, name: email.split('@')[0] });
      setIsAuthenticated(true);
      
      return { success: true, user: data.user };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || "Login failed" 
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout user - FIXED with credentials: "include"
  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include", // CRITICAL FIX - Add this line
      });
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Always clear local state
      localStorage.removeItem("authToken");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Verify Email - FIXED with credentials: "include"
  const verifyEmail = async (code) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/verify-email/${code}`, {
        method: "GET",
        credentials: "include", // Add this line
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to verify email (Status: ${response.status})`);
      }

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Role Helpers
  const isAdmin = () => user?.role === "admin";
  const isReporter = () => user?.role === "reporter";

  // Disaster CRUD operations - FIXED with credentials: "include"
  const createDisaster = async (disasterData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/disasters`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include", // Add this line
        body: JSON.stringify(disasterData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Failed to create disaster (Status: ${response.status})`);
      }

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
        headers: getAuthHeaders(),
        credentials: "include", // Add this line
        body: JSON.stringify(disasterData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Failed to update disaster (Status: ${response.status})`);
      }

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
        headers: getAuthHeaders(),
        credentials: "include", // Add this line
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Failed to delete disaster (Status: ${response.status})`);
      }

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

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
    getAuthHeaders,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};