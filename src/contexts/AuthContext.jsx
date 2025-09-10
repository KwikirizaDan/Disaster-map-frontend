import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for authentication
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component that will wrap the application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State to hold user data
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to check if user is authenticated
  const [loading, setLoading] = useState(true); // State to handle loading state of auth checks

  // Effect to check for an active session when the component mounts
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Attempt to fetch the user's profile
        const response = await fetch('http://127.0.0.1:5000/api/auth/profile', {
          credentials: 'include', // Necessary to send the session cookie
        });

        if (response.ok) {
          // If the request is successful, the user has a valid session
          const userData = await response.json();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Session check failed", error);
      } finally {
        // Stop loading once the check is complete
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Function to handle user registration
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to register');
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Function to handle user login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to login');

      // On successful login, fetch profile to update user state
      const profileResponse = await fetch('http://127.0.0.1:5000/api/auth/profile', {
        credentials: 'include',
      });
      if (profileResponse.ok) {
        const userData = await profileResponse.json();
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        throw new Error('Failed to fetch profile after login.');
      }
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Function to handle user logout
  const logout = async () => {
    setLoading(true);
    try {
      await fetch('http://127.0.0.1:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      // Clear user state regardless of API call success
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  // Function to handle email verification
  const verifyEmail = async (code) => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/auth/verify-email/${code}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to verify email');
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if the user is an admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Helper function to check if the user is a reporter
  const isReporter = () => {
    return user?.role === 'reporter';
  };

  // Function to create a new disaster
  const createDisaster = async (disasterData) => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/disasters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(disasterData),
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create disaster');
      return { success: true, message: data.message, disaster: data.disaster };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Function to update an existing disaster
  const updateDisaster = async (id, disasterData) => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/disasters/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(disasterData),
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update disaster');
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a disaster
  const deleteDisaster = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/disasters/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete disaster');
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // The value provided to the context consumers
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
