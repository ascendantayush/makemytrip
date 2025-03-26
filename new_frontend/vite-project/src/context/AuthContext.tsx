"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  createdAt?: string;
}

// Define context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    password: string,
    mobile: number
  ) => Promise<boolean>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  signup: async () => false,
  verifyOtp: async () => false,
  logout: () => {},
  checkAuthStatus: async () => {},
});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  // Check if user is already logged in on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Function to check authentication status
  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Fetch user data with the token

      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // If token is invalid, clear it
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, user } = data;

        // Save token to localStorage
        localStorage.setItem("token", token);

        // Update state
        setUser(user);
        setIsAuthenticated(true);

        // Show success message
        toast.success("Login successful!");
        return true;
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Login failed");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
      return false;
    }
  };

  // Signup function
  const signup = async (
    name: string,
    email: string,
    password: string,
    mobile: number
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, mobile }),
      });

      if (response.ok) {
        toast.success("Registration successful! Please verify your email.");
        return true;
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Registration failed");
        return false;
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred during registration");
      return false;
    }
  };

  // Verify OTP function
  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, user } = data;

        // Save token to localStorage
        localStorage.setItem("token", token);

        // Update state
        setUser(user);
        setIsAuthenticated(true);

        toast.success("Email verified successfully!");
        return true;
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Verification failed");
        return false;
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("An error occurred during verification");
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    verifyOtp,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
