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
  login: async (credentials: LoginCredentials): Promise<Response> => {
    console.log("credentials:", credentials);
  
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
  
    console.log("response:", response);
    return response; // Simply return the raw response
  },
  

  signup: async (userData: SignupData) => {
    const response = await api.post("/api/auth/register", userData)
    return response.data
  },

  verifyOtp: async (data: OtpVerification) => {
    console.log("data")
    console.log(data)
    const response = await api.post("/api/auth/verify-otp", data)
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get("/api/auth/me")
    return response.data
  },
}

// Flight services
export const flightService = {
  searchFlights: async (params: FlightSearchParams) => {
    try {
      const response = await axios.get(`${AVIATION_API_URL}/flights`, {
        params: {
          access_key: AVIATION_API_KEY,
          dep_iata: params.departureAirport,
          arr_iata: params.arrivalAirport,
          flight_date: params.date,
        },
      })
      return response.data
    } catch (error) {
      console.error("Error fetching flights:", error)
      // Fallback with mock data if API fails
      return {
        data: generateMockFlights(params.departureAirport, params.arrivalAirport, params.date),
      }
    }
  },
}

// Airport services
export const airportService = {
  searchAirports: async (query: string) => {
    try {
      const response = await api.get(`/api/airports/search?query=${query}`)
      return response.data
    } catch (error) {
      console.error("Error searching airports:", error)
      // Return mock data if API fails
      return {
        data: [
          { iata: "DEL", name: "Indira Gandhi International Airport", city: "New Delhi", country: "India" },
          { iata: "BOM", name: "Chhatrapati Shivaji International Airport", city: "Mumbai", country: "India" },
          { iata: "BLR", name: "Kempegowda International Airport", city: "Bangalore", country: "India" },
          { iata: "MAA", name: "Chennai International Airport", city: "Chennai", country: "India" },
          { iata: "CCU", name: "Netaji Subhas Chandra Bose International Airport", city: "Kolkata", country: "India" },
        ].filter(
          (airport) =>
            airport.iata.toLowerCase().includes(query.toLowerCase()) ||
            airport.city.toLowerCase().includes(query.toLowerCase()) ||
            airport.name.toLowerCase().includes(query.toLowerCase()),
        ),
      }
    }
  },
}

// Checkout services
export const checkoutService = {
  createCheckout: async (checkoutData: CheckoutData) => {
    const response = await api.post("/api/checkout", checkoutData)
    return response.data
  },

  getUserCheckouts: async (userId: string) => {
    const response = await api.get(`/api/checkout/user/${userId}`)
    return response.data
  },
}

// Order services
export const orderService = {
  createOrder: async (orderData: any) => {
    const response = await api.post("/api/orders", orderData)
    return response.data
  },

  getUserOrders: async (userId: string) => {
    const response = await api.get(`/api/orders/user/${userId}`)
    return response.data
  },
}

// Payment services
export const paymentService = {
  createPayment: async (paymentData: PaymentData) => {
    const response = await api.post("/api/payments/razorpay", paymentData)
    return response.data
  },

  confirmPayment: async (successData: SuccessData) => {
    const response = await api.post("/api/payments/success", successData)
    return response.data
  },
}

// Helper function to generate mock flight data
const generateMockFlights = (departureAirport: string, arrivalAirport: string, date: string) => {
  const airlines = [
    { name: "Air India", iata: "AI", icao: "AIC" },
    { name: "IndiGo", iata: "6E", icao: "IGO" },
    { name: "SpiceJet", iata: "SG", icao: "SEJ" },
    { name: "Vistara", iata: "UK", icao: "VTI" },
    { name: "GoAir", iata: "G8", icao: "GOW" },
  ]

  const airports: Record<string, { name: string; timezone: string }> = {
    DEL: { name: "Indira Gandhi International Airport", timezone: "Asia/Kolkata" },
    BOM: { name: "Chhatrapati Shivaji International Airport", timezone: "Asia/Kolkata" },
    BLR: { name: "Kempegowda International Airport", timezone: "Asia/Kolkata" },
    MAA: { name: "Chennai International Airport", timezone: "Asia/Kolkata" },
    CCU: { name: "Netaji Subhas Chandra Bose International Airport", timezone: "Asia/Kolkata" },
    HYD: { name: "Rajiv Gandhi International Airport", timezone: "Asia/Kolkata" },
    JFK: { name: "John F. Kennedy International Airport", timezone: "America/New_York" },
    LHR: { name: "Heathrow Airport", timezone: "Europe/London" },
    DXB: { name: "Dubai International Airport", timezone: "Asia/Dubai" },
    SIN: { name: "Singapore Changi Airport", timezone: "Asia/Singapore" },
  }

  // Default to DEL and BOM if airports not found
  const depAirport = airports[departureAirport] || airports["DEL"]
  const arrAirport = airports[arrivalAirport] || airports["BOM"]

  // Generate 5-10 random flights
  const numFlights = Math.floor(Math.random() * 6) + 5
  const flights = []

  for (let i = 0; i < numFlights; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)]
    const flightNumber = Math.floor(Math.random() * 9000) + 1000

    // Generate random departure time between 6 AM and 10 PM
    const depHour = Math.floor(Math.random() * 16) + 6
    const depMinute = Math.floor(Math.random() * 60)

    // Parse the date
    const [year, month, day] = date.split("-").map(Number)

    // Create departure date
    const depDate = new Date(year, month - 1, day, depHour, depMinute)

    // Flight duration between 1.5 and 4 hours
    const durationMinutes = Math.floor(Math.random() * 150) + 90

    // Calculate arrival date
    const arrDate = new Date(depDate.getTime() + durationMinutes * 60000)

    // Random price between 5000 and 15000
    const price = Math.floor(Math.random() * 10000) + 5000

    // Random terminal and gate
    const depTerminal = String.fromCharCode(65 + Math.floor(Math.random() * 3))
    const depGate = String(Math.floor(Math.random() * 30) + 1)
    const arrTerminal = String.fromCharCode(65 + Math.floor(Math.random() * 3))
    const arrGate = String(Math.floor(Math.random() * 30) + 1)

    flights.push({
      flight_date: date,
      flight_status: Math.random() > 0.1 ? "scheduled" : "delayed",
      departure: {
        airport: depAirport.name,
        timezone: depAirport.timezone,
        iata: departureAirport,
        icao: departureAirport + "X",
        terminal: depTerminal,
        gate: depGate,
        delay: Math.random() > 0.8 ? Math.floor(Math.random() * 60) + 15 : 0,
        scheduled: depDate.toISOString(),
        estimated: depDate.toISOString(),
        actual: null,
        estimated_runway: null,
        actual_runway: null,
      },
      arrival: {
        airport: arrAirport.name,
        timezone: arrAirport.timezone,
        iata: arrivalAirport,
        icao: arrivalAirport + "X",
        terminal: arrTerminal,
        baggage: "B" + Math.floor(Math.random() * 10),
        gate: arrGate,
        delay: Math.random() > 0.9 ? Math.floor(Math.random() * 60) + 15 : 0,
        scheduled: arrDate.toISOString(),
        estimated: arrDate.toISOString(),
        actual: null,
        estimated_runway: null,
        actual_runway: null,
      },
      airline: {
        name: airline.name,
        iata: airline.iata,
        icao: airline.icao,
      },
      flight: {
        number: String(flightNumber),
        iata: airline.iata + flightNumber,
        icao: airline.icao + flightNumber,
        codeshared: null,
      },
      aircraft: null,
      live: null,
      price: price,
    })
  }

  return flights
}

export default api

