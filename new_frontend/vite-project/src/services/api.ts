import axios from "axios";
import type {
  CheckoutData,
  FlightSearchParams,
  LoginCredentials,
  OtpVerification,
  PaymentData,
  SignupData,
  SuccessData,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL;
const AVIATION_API_URL = "http://api.aviationstack.com/v1";
const AVIATION_API_KEY = import.meta.env.VITE_AVIATION_API_KEY;

// Create axios instance for our backend
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const authService = {
  login: async (credentials: LoginCredentials): Promise<Response> => {
    console.log("credentials:", credentials);

    const response = await fetch(`${API_URL}/api/auth/login`, {
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
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  },

  verifyOtp: async (data: OtpVerification) => {
    console.log("data");
    console.log(data);
    const response = await api.post("/api/auth/verify-otp", data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/api/auth/me");
    return response.data;
  },
};

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
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching flights:", error);
      // Fallback with mock data if API fails
      return {
        data: generateMockFlights(
          params.departureAirport,
          params.arrivalAirport,
          params.date
        ),
      };
    }
  },
};

// Airport services
export const airportService = {
  searchAirports: async (query: string) => {
    try {
      const response = await api.get(`/api/airports/search?query=${query}`);
      return response.data;
    } catch (error) {
      console.error("Error searching airports:", error);
      // Return mock data if API fails
      return {
        data: [
          {
            iata: "ATL",
            name: "Hartsfield-Jackson Atlanta International Airport",
            city: "Atlanta",
            country: "USA",
          },
          {
            iata: "PEK",
            name: "Beijing Capital International Airport",
            city: "Beijing",
            country: "China",
          },
          {
            iata: "LHR",
            name: "Heathrow Airport",
            city: "London",
            country: "United Kingdom",
          },
          {
            iata: "ORD",
            name: "O'Hare International Airport",
            city: "Chicago",
            country: "USA",
          },
          {
            iata: "LAX",
            name: "Los Angeles International Airport",
            city: "Los Angeles",
            country: "USA",
          },
          {
            iata: "DXB",
            name: "Dubai International Airport",
            city: "Dubai",
            country: "UAE",
          },
          {
            iata: "HND",
            name: "Tokyo Haneda Airport",
            city: "Tokyo",
            country: "Japan",
          },
          {
            iata: "CDG",
            name: "Charles de Gaulle Airport",
            city: "Paris",
            country: "France",
          },
          {
            iata: "DFW",
            name: "Dallas/Fort Worth International Airport",
            city: "Dallas",
            country: "USA",
          },
          {
            iata: "CAN",
            name: "Guangzhou Baiyun International Airport",
            city: "Guangzhou",
            country: "China",
          },
          {
            iata: "AMS",
            name: "Amsterdam Schiphol Airport",
            city: "Amsterdam",
            country: "Netherlands",
          },
          {
            iata: "FRA",
            name: "Frankfurt Airport",
            city: "Frankfurt",
            country: "Germany",
          },
          {
            iata: "IST",
            name: "Istanbul Airport",
            city: "Istanbul",
            country: "Turkey",
          },
          {
            iata: "SIN",
            name: "Singapore Changi Airport",
            city: "Singapore",
            country: "Singapore",
          },
          {
            iata: "JFK",
            name: "John F. Kennedy International Airport",
            city: "New York",
            country: "USA",
          },
          {
            iata: "ICN",
            name: "Incheon International Airport",
            city: "Seoul",
            country: "South Korea",
          },
          {
            iata: "DEL",
            name: "Indira Gandhi International Airport",
            city: "New Delhi",
            country: "India",
          },
          {
            iata: "BOM",
            name: "Chhatrapati Shivaji International Airport",
            city: "Mumbai",
            country: "India",
          },
          {
            iata: "SYD",
            name: "Sydney Kingsford Smith Airport",
            city: "Sydney",
            country: "Australia",
          },
          {
            iata: "YYZ",
            name: "Toronto Pearson International Airport",
            city: "Toronto",
            country: "Canada",
          },
          {
            iata: "GRU",
            name: "São Paulo-Guarulhos International Airport",
            city: "São Paulo",
            country: "Brazil",
          },
          {
            iata: "MEX",
            name: "Mexico City International Airport",
            city: "Mexico City",
            country: "Mexico",
          },
          {
            iata: "ZRH",
            name: "Zurich Airport",
            city: "Zurich",
            country: "Switzerland",
          },
          {
            iata: "BCN",
            name: "Barcelona-El Prat Airport",
            city: "Barcelona",
            country: "Spain",
          },
          {
            iata: "KUL",
            name: "Kuala Lumpur International Airport",
            city: "Kuala Lumpur",
            country: "Malaysia",
          },
          {
            iata: "HKG",
            name: "Hong Kong International Airport",
            city: "Hong Kong",
            country: "Hong Kong",
          },
          {
            iata: "BKK",
            name: "Suvarnabhumi Airport",
            city: "Bangkok",
            country: "Thailand",
          },
          {
            iata: "SFO",
            name: "San Francisco International Airport",
            city: "San Francisco",
            country: "USA",
          },
          {
            iata: "MUC",
            name: "Munich Airport",
            city: "Munich",
            country: "Germany",
          },
          {
            iata: "MNL",
            name: "Ninoy Aquino International Airport",
            city: "Manila",
            country: "Philippines",
          },
          {
            iata: "GIG",
            name: "Rio de Janeiro-Galeão International Airport",
            city: "Rio de Janeiro",
            country: "Brazil",
          },
          {
            iata: "CPT",
            name: "Cape Town International Airport",
            city: "Cape Town",
            country: "South Africa",
          },
          {
            iata: "NRT",
            name: "Narita International Airport",
            city: "Tokyo",
            country: "Japan",
          },
          {
            iata: "VIE",
            name: "Vienna International Airport",
            city: "Vienna",
            country: "Austria",
          },
          {
            iata: "ARN",
            name: "Stockholm Arlanda Airport",
            city: "Stockholm",
            country: "Sweden",
          },
          {
            iata: "OSL",
            name: "Oslo Gardermoen Airport",
            city: "Oslo",
            country: "Norway",
          },
          {
            iata: "HEL",
            name: "Helsinki-Vantaa Airport",
            city: "Helsinki",
            country: "Finland",
          },
          {
            iata: "CPH",
            name: "Copenhagen Airport",
            city: "Copenhagen",
            country: "Denmark",
          },
          {
            iata: "BRU",
            name: "Brussels Airport",
            city: "Brussels",
            country: "Belgium",
          },
          {
            iata: "DEL",
            name: "Indira Gandhi International Airport",
            city: "New Delhi",
            country: "India",
          },
          {
            iata: "BLR",
            name: "Kempegowda International Airport",
            city: "Bangalore",
            country: "India",
          },
          {
            iata: "MAA",
            name: "Chennai International Airport",
            city: "Chennai",
            country: "India",
          },
          {
            iata: "CCU",
            name: "Netaji Subhas Chandra Bose International Airport",
            city: "Kolkata",
            country: "India",
          },
          {
            iata: "HYD",
            name: "Rajiv Gandhi International Airport",
            city: "Hyderabad",
            country: "India",
          },
          {
            iata: "GOI",
            name: "Goa International Airport",
            city: "Goa",
            country: "India",
          },
          {
            iata: "AMD",
            name: "Sardar Vallabhbhai Patel International Airport",
            city: "Ahmedabad",
            country: "India",
          },
          {
            iata: "PNQ",
            name: "Pune International Airport",
            city: "Pune",
            country: "India",
          },
          {
            iata: "COK",
            name: "Cochin International Airport",
            city: "Kochi",
            country: "India",
          },
          {
            iata: "TRV",
            name: "Trivandrum International Airport",
            city: "Thiruvananthapuram",
            country: "India",
          },
          {
            iata: "IXM",
            name: "Madurai Airport",
            city: "Madurai",
            country: "India",
          },
          {
            iata: "IXB",
            name: "Bagdogra Airport",
            city: "Siliguri",
            country: "India",
          },
          {
            iata: "BBI",
            name: "Biju Patnaik International Airport",
            city: "Bhubaneswar",
            country: "India",
          },
          {
            iata: "IXJ",
            name: "Jammu Airport",
            city: "Jammu",
            country: "India",
          },
          {
            iata: "IXC",
            name: "Chandigarh Airport",
            city: "Chandigarh",
            country: "India",
          },
          {
            iata: "VGA",
            name: "Vijayawada Airport",
            city: "Vijayawada",
            country: "India",
          },
          {
            iata: "JAI",
            name: "Jaipur International Airport",
            city: "Jaipur",
            country: "India",
          },
          {
            iata: "LKO",
            name: "Chaudhary Charan Singh International Airport",
            city: "Lucknow",
            country: "India",
          },
          {
            iata: "IXZ",
            name: "Veer Savarkar International Airport",
            city: "Port Blair",
            country: "India",
          },
          {
            iata: "PAT",
            name: "Lok Nayak Jayaprakash Airport",
            city: "Patna",
            country: "India",
          },
          {
            iata: "RPR",
            name: "Swami Vivekananda Airport",
            city: "Raipur",
            country: "India",
          },
          {
            iata: "GOP",
            name: "Gorakhpur Airport",
            city: "Gorakhpur",
            country: "India",
          },

          {
            iata: "LHR",
            name: "Heathrow Airport",
            city: "London",
            country: "United Kingdom",
          },
          {
            iata: "JFK",
            name: "John F. Kennedy International Airport",
            city: "New York",
            country: "United States",
          },
          {
            iata: "CDG",
            name: "Charles de Gaulle Airport",
            city: "Paris",
            country: "France",
          },
          {
            iata: "DXB",
            name: "Dubai International Airport",
            city: "Dubai",
            country: "United Arab Emirates",
          },
          {
            iata: "HKG",
            name: "Hong Kong International Airport",
            city: "Hong Kong",
            country: "China",
          },
          {
            iata: "NRT",
            name: "Narita International Airport",
            city: "Tokyo",
            country: "Japan",
          },
          {
            iata: "SYD",
            name: "Sydney Kingsford Smith Airport",
            city: "Sydney",
            country: "Australia",
          },
          {
            iata: "LAX",
            name: "Los Angeles International Airport",
            city: "Los Angeles",
            country: "United States",
          },
          {
            iata: "FRA",
            name: "Frankfurt Airport",
            city: "Frankfurt",
            country: "Germany",
          },
          {
            iata: "SIN",
            name: "Singapore Changi Airport",
            city: "Singapore",
            country: "Singapore",
          },
          {
            iata: "PEK",
            name: "Beijing Capital International Airport",
            city: "Beijing",
            country: "China",
          },
          {
            iata: "AMS",
            name: "Amsterdam Schiphol Airport",
            city: "Amsterdam",
            country: "Netherlands",
          },
          {
            iata: "IST",
            name: "Istanbul Airport",
            city: "Istanbul",
            country: "Turkey",
          },
          {
            iata: "YYZ",
            name: "Toronto Pearson International Airport",
            city: "Toronto",
            country: "Canada",
          },
          {
            iata: "ICN",
            name: "Incheon International Airport",
            city: "Seoul",
            country: "South Korea",
          },
          {
            iata: "GRU",
            name: "São Paulo–Guarulhos International Airport",
            city: "São Paulo",
            country: "Brazil",
          },
          {
            iata: "MEX",
            name: "Mexico City International Airport",
            city: "Mexico City",
            country: "Mexico",
          },
          {
            iata: "JNB",
            name: "O.R. Tambo International Airport",
            city: "Johannesburg",
            country: "South Africa",
          },
          {
            iata: "SVO",
            name: "Sheremetyevo International Airport",
            city: "Moscow",
            country: "Russia",
          },
          {
            iata: "BKK",
            name: "Suvarnabhumi Airport",
            city: "Bangkok",
            country: "Thailand",
          },
        ].filter(
          (airport) =>
            airport.iata.toLowerCase().includes(query.toLowerCase()) ||
            airport.city.toLowerCase().includes(query.toLowerCase()) ||
            airport.name.toLowerCase().includes(query.toLowerCase())
        ),
      };
    }
  },
};

// Checkout services
export const checkoutService = {
  createCheckout: async (checkoutData: CheckoutData) => {
    const response = await api.post("/api/checkout", checkoutData);
    return response.data;
  },

  getUserCheckouts: async (userId: string) => {
    const response = await api.get(`/api/checkout/user/${userId}`);
    return response.data;
  },
};

// Order services
export const orderService = {
  createOrder: async (orderData: any) => {
    const response = await api.post("/api/orders", orderData);
    return response.data;
  },

  getUserOrders: async (userId: string) => {
    const response = await api.get(`/api/orders/user/${userId}`);
    return response.data;
  },
};

// Payment services
export const paymentService = {
  createPayment: async (paymentData: PaymentData) => {
    const response = await api.post("/api/payments/razorpay", paymentData);
    return response.data;
  },

  confirmPayment: async (successData: SuccessData) => {
    const response = await api.post("/api/payments/success", successData);
    return response.data;
  },
};

// Helper function to generate mock flight data
const generateMockFlights = (
  departureAirport: string,
  arrivalAirport: string,
  date: string
) => {
  const airlines = [
    { name: "Air India", iata: "AI", icao: "AIC" },
    { name: "IndiGo", iata: "6E", icao: "IGO" },
    { name: "SpiceJet", iata: "SG", icao: "SEJ" },
    { name: "Vistara", iata: "UK", icao: "VTI" },
    { name: "GoAir", iata: "G8", icao: "GOW" },
  ];

  const airports: Record<string, { name: string; timezone: string }> = {
    DEL: {
      name: "Indira Gandhi International Airport",
      timezone: "Asia/Kolkata",
    },
    BOM: {
      name: "Chhatrapati Shivaji International Airport",
      timezone: "Asia/Kolkata",
    },
    BLR: { name: "Kempegowda International Airport", timezone: "Asia/Kolkata" },
    MAA: { name: "Chennai International Airport", timezone: "Asia/Kolkata" },
    CCU: {
      name: "Netaji Subhas Chandra Bose International Airport",
      timezone: "Asia/Kolkata",
    },
    HYD: {
      name: "Rajiv Gandhi International Airport",
      timezone: "Asia/Kolkata",
    },
    JFK: {
      name: "John F. Kennedy International Airport",
      timezone: "America/New_York",
    },
    LHR: { name: "Heathrow Airport", timezone: "Europe/London" },
    DXB: { name: "Dubai International Airport", timezone: "Asia/Dubai" },
    SIN: { name: "Singapore Changi Airport", timezone: "Asia/Singapore" },
    GOP: { name: "Gorakhpur Airport", timezone: "Asia/Kolkata" },
    PAT: { name: "Lok Nayak Jayaprakash Airport", timezone: "Asia/Kolkata" },
    PNQ: { name: "Pune International Airport", timezone: "Asia/Kolkata" },
    COK: { name: "Cochin International Airport", timezone: "Asia/Kolkata" },
    TRV: { name: "Trivandrum International Airport", timezone: "Asia/Kolkata" },
    IXM: { name: "Madurai Airport", timezone: "Asia/Kolkata" },
    IXB: { name: "Bagdogra Airport", timezone: "Asia/Kolkata" },
    BBI: {
      name: "Biju Patnaik International Airport",
      timezone: "Asia/Kolkata",
    },
    IXJ: { name: "Jammu Airport", timezone: "Asia/Kolkata" },
    IXC: { name: "Chandigarh Airport", timezone: "Asia/Kolkata" },
    VGA: { name: "Vijayawada Airport", timezone: "Asia/Kolkata" },
    JAI: { name: "Jaipur International Airport", timezone: "Asia/Kolkata" },
    LKO: {
      name: "Chaudhary Charan Singh International Airport",
      timezone: "Asia/Kolkata",
    },
    IXZ: {
      name: "Veer Savarkar International Airport",
      timezone: "Asia/Kolkata",
    },
    RPR: { name: "Swami Vivekananda Airport", timezone: "Asia/Kolkata" },

    CDG: { name: "Charles de Gaulle Airport", timezone: "Europe/Paris" },
    HKG: {
      name: "Hong Kong International Airport",
      timezone: "Asia/Hong_Kong",
    },
    NRT: { name: "Narita International Airport", timezone: "Asia/Tokyo" },
    SYD: {
      name: "Sydney Kingsford Smith Airport",
      timezone: "Australia/Sydney",
    },
    LAX: {
      name: "Los Angeles International Airport",
      timezone: "America/Los_Angeles",
    },
    FRA: { name: "Frankfurt Airport", timezone: "Europe/Berlin" },

    PEK: {
      name: "Beijing Capital International Airport",
      timezone: "Asia/Shanghai",
    },
    AMS: { name: "Amsterdam Schiphol Airport", timezone: "Europe/Amsterdam" },
    IST: { name: "Istanbul Airport", timezone: "Europe/Istanbul" },
    YYZ: {
      name: "Toronto Pearson International Airport",
      timezone: "America/Toronto",
    },
    ICN: { name: "Incheon International Airport", timezone: "Asia/Seoul" },
    GRU: {
      name: "São Paulo–Guarulhos International Airport",
      timezone: "America/Sao_Paulo",
    },
    MEX: {
      name: "Mexico City International Airport",
      timezone: "America/Mexico_City",
    },
    JNB: {
      name: "O.R. Tambo International Airport",
      timezone: "Africa/Johannesburg",
    },
    SVO: {
      name: "Sheremetyevo International Airport",
      timezone: "Europe/Moscow",
    },
    BKK: { name: "Suvarnabhumi Airport", timezone: "Asia/Bangkok" },
    ATL: {
      name: "Hartsfield-Jackson Atlanta International Airport",
      timezone: "America/New_York",
    },
    // PEK: { name: "Beijing Capital International Airport", timezone: "Asia/Shanghai" },
    // LHR: { name: "Heathrow Airport", timezone: "Europe/London" },
    ORD: { name: "O'Hare International Airport", timezone: "America/Chicago" },
    // LAX: { name: "Los Angeles International Airport", timezone: "America/Los_Angeles" },
    // DXB: { name: "Dubai International Airport", timezone: "Asia/Dubai" },
    HND: { name: "Tokyo Haneda Airport", timezone: "Asia/Tokyo" },
    // CDG: { name: "Charles de Gaulle Airport", timezone: "Europe/Paris" },
    DFW: {
      name: "Dallas/Fort Worth International Airport",
      timezone: "America/Chicago",
    },
    CAN: {
      name: "Guangzhou Baiyun International Airport",
      timezone: "Asia/Shanghai",
    },
    // AMS: { name: "Amsterdam Schiphol Airport", timezone: "Europe/Amsterdam" },
    // FRA: { name: "Frankfurt Airport", timezone: "Europe/Berlin" },
    // IST: { name: "Istanbul Airport", timezone: "Europe/Istanbul" },
    // SIN: { name: "Singapore Changi Airport", timezone: "Asia/Singapore" },
    // JFK: { name: "John F. Kennedy International Airport", timezone: "America/New_York" },
    // ICN: { name: "Incheon International Airport", timezone: "Asia/Seoul" },
    // DEL: { name: "Indira Gandhi International Airport", timezone: "Asia/Kolkata" },
    // BOM: { name: "Chhatrapati Shivaji International Airport", timezone: "Asia/Kolkata" },
    // SYD: { name: "Sydney Kingsford Smith Airport", timezone: "Australia/Sydney" },
    // YYZ: { name: "Toronto Pearson International Airport", timezone: "America/Toronto" },
    // GRU: { name: "São Paulo-Guarulhos International Airport", timezone: "America/Sao_Paulo" },
    // MEX: { name: "Mexico City International Airport", timezone: "America/Mexico_City" },
    ZRH: { name: "Zurich Airport", timezone: "Europe/Zurich" },
    BCN: { name: "Barcelona-El Prat Airport", timezone: "Europe/Madrid" },
    KUL: {
      name: "Kuala Lumpur International Airport",
      timezone: "Asia/Kuala_Lumpur",
    },
    // HKG: { name: "Hong Kong International Airport", timezone: "Asia/Hong_Kong" },
    // BKK: { name: "Suvarnabhumi Airport", timezone: "Asia/Bangkok" },
    SFO: {
      name: "San Francisco International Airport",
      timezone: "America/Los_Angeles",
    },
    MUC: { name: "Munich Airport", timezone: "Europe/Berlin" },
    MNL: {
      name: "Ninoy Aquino International Airport",
      timezone: "Asia/Manila",
    },
    GIG: {
      name: "Rio de Janeiro-Galeão International Airport",
      timezone: "America/Sao_Paulo",
    },
    CPT: {
      name: "Cape Town International Airport",
      timezone: "Africa/Johannesburg",
    },
    // NRT: { name: "Narita International Airport", timezone: "Asia/Tokyo" },
    VIE: { name: "Vienna International Airport", timezone: "Europe/Vienna" },
    ARN: { name: "Stockholm Arlanda Airport", timezone: "Europe/Stockholm" },
    OSL: { name: "Oslo Gardermoen Airport", timezone: "Europe/Oslo" },
    HEL: { name: "Helsinki-Vantaa Airport", timezone: "Europe/Helsinki" },
    CPH: { name: "Copenhagen Airport", timezone: "Europe/Copenhagen" },
    BRU: { name: "Brussels Airport", timezone: "Europe/Brussels" },
  };

  // Default to DEL and BOM if airports not found
  const depAirport = airports[departureAirport] || airports["DEL"];
  const arrAirport = airports[arrivalAirport] || airports["BOM"];

  // Generate 5-10 random flights
  const numFlights = Math.floor(Math.random() * 6) + 5;
  const flights = [];

  for (let i = 0; i < numFlights; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const flightNumber = Math.floor(Math.random() * 9000) + 1000;

    // Generate random departure time between 6 AM and 10 PM
    const depHour = Math.floor(Math.random() * 16) + 6;
    const depMinute = Math.floor(Math.random() * 60);

    // Parse the date
    const [year, month, day] = date.split("-").map(Number);

    // Create departure date
    const depDate = new Date(year, month - 1, day, depHour, depMinute);

    // Flight duration between 1.5 and 4 hours
    const durationMinutes = Math.floor(Math.random() * 150) + 90;

    // Calculate arrival date
    const arrDate = new Date(depDate.getTime() + durationMinutes * 60000);

    // Random price between 5000 and 15000
    const price = Math.floor(Math.random() * 10000) + 5000;

    // Random terminal and gate
    const depTerminal = String.fromCharCode(65 + Math.floor(Math.random() * 3));
    const depGate = String(Math.floor(Math.random() * 30) + 1);
    const arrTerminal = String.fromCharCode(65 + Math.floor(Math.random() * 3));
    const arrGate = String(Math.floor(Math.random() * 30) + 1);

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
    });
  }

  return flights;
};

export default api;
