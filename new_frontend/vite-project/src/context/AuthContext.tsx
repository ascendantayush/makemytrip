"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "../types"
import { authService } from "../services/api"
import { toast } from "react-hot-toast"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, mobile: number) => Promise<void>
  verifyOtp: (email: string, otp: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const userData = await authService.getCurrentUser()
          setUser(userData)
          setIsAuthenticated(true)
        } catch (error) {
          localStorage.removeItem("token")
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response = await authService.login({ email, password })
      localStorage.setItem("token", response.token)
      setUser(response.user)
      setIsAuthenticated(true)
      toast.success("Login successful!")
    } catch (error) {
      toast.error("Login failed. Please check your credentials.")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string, mobile: number) => {
    try {
      setLoading(true)
      await authService.signup({ name, email, password, mobile })
      toast.success("Signup successful! Please verify your email with the OTP sent.")
    } catch (error) {
      toast.error("Signup failed. Please try again.")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (email: string, otp: string) => {
    try {
      setLoading(true)
      const response = await authService.verifyOtp({ email, otp })
      localStorage.setItem("token", response.token)
      setUser(response.user)
      setIsAuthenticated(true)
      toast.success("Email verified successfully!")
    } catch (error) {
      toast.error("OTP verification failed. Please try again.")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setIsAuthenticated(false)
    toast.success("Logged out successfully!")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        verifyOtp,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

