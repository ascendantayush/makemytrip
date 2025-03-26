// User types
export interface User {
  _id: string
  name: string
  email: string
  mobile: number
}

// Auth types
export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  name: string
  email: string
  password: string
  mobile: number
}

export interface OtpVerification {
  email: string
  otp: string
}

// Flight types
// export interface Flight {
//   flight_date: string
//   flight_status: string
//   departure: {
//     airport: string
//     timezone: string
//     iata: string
//     icao: string
//     terminal: string
//     gate: string
//     delay: number
//     scheduled: string
//     estimated: string
//     actual: string
//     estimated_runway: string
//     actual_runway: string
//   }
//   arrival: {
//     airport: string
//     timezone: string
//     iata: string
//     icao: string
//     terminal: string
//     baggage: string
//     gate: string
//     delay: number
//     scheduled: string
//     estimated: string
//     actual: string
//     estimated_runway: string
//     actual_runway: string
//   }
//   airline: {
//     name: string
//     iata: string
//     icao: string
//   }
//   flight: {
//     number: string
//     iata: string
//     icao: string
//     codeshared: null | any
//   }
//   aircraft: null | any
//   live: null | any
//   price?: number
// }
export interface Flight {
  flight: {
    iata: string
  }
  airline: {
    name: string;
  };
  departure: {
    scheduled: string
    airport: string
    iata: string
  }
  arrival: {
    scheduled: string
    airport: string
    iata: string
  }
  price: number
  flight_status: string;
}

export interface FlightSearchParams {
  departureAirport: string
  arrivalAirport: string
  date: string
}

// Checkout types
export interface CheckoutData {
  price: {
    base_fare: number
    surcharges: number
  }
  date: string
  user: string
}

// Payment types
export interface PaymentData {
  params: {
    price: number
  }
}

export interface PaymentResponse {
  id: string
  currency: string
  amount: number
}

export interface SuccessData {
  razorpay_order_id: string
  razorpay_payment_id: string
  user: string
}

