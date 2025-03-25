import axios from "axios"
import type {
  LoginCredentials,
  SignupData,
  OtpVerification,
  FlightSearchParams,
  CheckoutData,
  PaymentData,
  SuccessData,
} from "../types"

const API_URL = "http://localhost:5000"
const AVIATION_API_URL = "http://api.aviationstack.com/v1"
const AVIATION_API_KEY = import.meta.env.VITE_AVIATION_API_KEY

// Create axios instance for our backend
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth services
export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post("/users/login", credentials)
    return response.data
  },

  signup: async (userData: SignupData) => {
    const response = await api.post("/users", userData)
    return response.data
  },

  verifyOtp: async (data: OtpVerification) => {
    const response = await api.post("/users/verify-otp", data)
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get("/users/me")
    return response.data
  },
}

// Flight services
export const flightService = {
  searchFlights: async (params: FlightSearchParams) => {
    const response = await axios.get(`${AVIATION_API_URL}/flights`, {
      params: {
        access_key: AVIATION_API_KEY,
        dep_iata: params.departureAirport,
        arr_iata: params.arrivalAirport,
        flight_date: params.date,
      },
    })
    return response.data
  },
}

// Checkout services
export const checkoutService = {
  createCheckout: async (checkoutData: CheckoutData) => {
    const response = await api.post("/checkout", checkoutData)
    return response.data
  },

  getUserCheckouts: async (userId: string) => {
    const response = await api.get(`/checkout/${userId}`)
    return response.data
  },
}

// Order services
export const orderService = {
  createOrder: async (orderData: any) => {
    const response = await api.post("/order", orderData)
    return response.data
  },

  getUserOrders: async (userId: string) => {
    const response = await api.get(`/order/${userId}`)
    return response.data
  },
}

// Payment services
export const paymentService = {
  createPayment: async (paymentData: PaymentData) => {
    const response = await api.post("/razorpay", paymentData)
    return response.data
  },

  confirmPayment: async (successData: SuccessData) => {
    const response = await api.post("/success", successData)
    return response.data
  },
}

export default api

