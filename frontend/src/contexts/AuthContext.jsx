import { createContext, useContext, useState, useEffect } from "react";
import { authAPI, userAPI } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Test mode - bypass API calls for demonstration
  const isTestMode = import.meta.env.VITE_TEST_MODE === "true";

  useEffect(() => {
    const verifyToken = async () => {
      if (token && !isTestMode) {
        try {
          const apiResponse = await userAPI.getMe();
          setUser(apiResponse.data);
        } catch {
          localStorage.removeItem("token");
          setToken(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // Add this effect to handle authentication state changes
  useEffect(() => {
    // This will trigger re-render when user state changes
  }, [user]);

  const login = async (credentials) => {
    try {
      if (!isTestMode) {
        const response = await authAPI.signin(credentials);
        const { token: newToken, user: userData } = response.data.data;

        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser(userData);

        return { success: true };
      } else {
        // Mock successful login for testing
        const mockUser = {
          _id: "test-user-id",
          firstName: "Test",
          lastName: "User",
          email: credentials.email,
        };

        localStorage.setItem("token", "mock-token");
        setToken("mock-token");
        setUser(mockUser);

        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const signup = async (userData) => {
    try {
      if (!isTestMode) {
        const response = await authAPI.signup(userData);
        const { token: newToken, user: newUser } = response.data.data;

        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser(newUser);

        return { success: true };
      } else {
        // Mock successful signup for testing
        const mockUser = {
          _id: "test-user-id",
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
        };

        localStorage.setItem("token", "mock-token");
        setToken("mock-token");
        setUser(mockUser);

        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Signup failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
