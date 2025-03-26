"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FiArrowLeft, FiCalendar, FiClock, FiMapPin, FiUser, FiCreditCard } from "react-icons/fi"
import type { Flight } from "../types"

// Define passenger type
interface Passenger {
  name: string
  email: string
  phone: string
}

// Define order type
interface Order {
  id: string
  amount: number
  currency: string
  receipt: string
}

const CheckoutPage = () => {
  const navigate = useNavigate()
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [passenger, setPassenger] = useState<Passenger>({
    name: "",
    email: "",
    phone: "",
  })
  const [paymentProcessing, setPaymentProcessing] = useState(false)

  useEffect(() => {
    // Retrieve selected flight from session storage
    const flightData = sessionStorage.getItem("selectedFlight")
    if (flightData) {
      setSelectedFlight(JSON.parse(flightData))
    } else {
      setError("No flight selected. Please select a flight first.")
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPassenger((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const calculateDuration = (departure: string, arrival: string) => {
    const departureTime = new Date(departure).getTime()
    const arrivalTime = new Date(arrival).getTime()
    const durationMs = arrivalTime - departureTime
    const hours = Math.floor(durationMs / (1000 * 60 * 60))
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFlight) {
      setError("No flight selected")
      return
    }

    // Validate passenger information
    if (!passenger.name || !passenger.email || !passenger.phone) {
      setError("Please fill in all passenger details")
      return
    }

    try {
      setPaymentProcessing(true)
      setError(null)

      // Create order on the server
      const response = await fetch("http://localhost:5000/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          amount: selectedFlight.price * 100, // Razorpay expects amount in paise
          currency: "INR",
          receipt: `flight-${selectedFlight.flight.iata}-${Date.now()}`,
          flightDetails: {
            flightNumber: selectedFlight.flight.iata,
            departure: selectedFlight.departure.airport,
            arrival: selectedFlight.arrival.airport,
            departureTime: selectedFlight.departure.scheduled,
            arrivalTime: selectedFlight.arrival.scheduled,
          },
          passengerDetails: passenger,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create order")
      }

      const orderData = await response.json()

      // Initialize Razorpay
      const options = {
        key: "rzp_test_vXjmhk8QfuHliC", // Your Razorpay Key ID
        amount: orderData.amount,
        currency: orderData.currency,
        name: "SkyWings Airlines",
        description: `Flight ${selectedFlight.flight.iata} Booking`,
        order_id: orderData.id,
        handler: async (response: any) => {
          try {
            // Verify payment on the server
            const verifyResponse = await fetch("http://localhost:5000/api/payment/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed")
            }

            const verificationData = await verifyResponse.json()

            // Navigate to success page
            navigate("/booking-success", {
              state: {
                bookingId: verificationData.bookingId,
                flightDetails: selectedFlight,
                passengerDetails: passenger,
              },
            })
          } catch (error) {
            console.error("Payment verification error:", error)
            setError("Payment verification failed. Please contact support.")
            setPaymentProcessing(false)
          }
        },
        prefill: {
          name: passenger.name,
          email: passenger.email,
          contact: passenger.phone,
        },
        theme: {
          color: "#6366F1",
        },
        modal: {
          ondismiss: () => {
            setPaymentProcessing(false)
          },
        },
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error("Checkout error:", error)
      setError("Failed to process payment. Please try again.")
      setPaymentProcessing(false)
    }
  }

  if (!selectedFlight && !error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button onClick={() => navigate(-1)} className="flex items-center text-purple-600 hover:text-purple-800 mb-6">
          <FiArrowLeft className="mr-2" />
          Back to search results
        </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-6">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
            <h1 className="text-2xl font-bold">Complete Your Booking</h1>
            <p className="text-white/80 mt-1">Review your flight details and proceed to payment</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-4 border-l-4 border-red-500">{error}</div>}

          {selectedFlight && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Flight Details</h2>

              <div className="bg-purple-50 rounded-lg p-4 mb-6">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div className="mb-4 md:mb-0">
                    <div className="text-sm text-gray-500 flex items-center mb-1">
                      <FiCalendar className="mr-1" />
                      {formatDate(selectedFlight.departure.scheduled)}
                    </div>
                    <div className="text-xl font-bold text-gray-900">{selectedFlight.flight.iata}</div>
                  </div>

                  <div className="flex items-center">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">
                        {formatTime(selectedFlight.departure.scheduled)}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center justify-center">
                        <FiMapPin className="mr-1" />
                        {selectedFlight.departure.airport}
                      </div>
                    </div>

                    <div className="mx-4 flex flex-col items-center">
                      <div className="text-xs text-gray-500 mb-1">
                        {calculateDuration(selectedFlight.departure.scheduled, selectedFlight.arrival.scheduled)}
                      </div>
                      <div className="w-20 h-0.5 bg-gray-300 relative">
                        <div className="absolute w-2 h-2 bg-purple-600 rounded-full -top-0.75 -left-1"></div>
                        <div className="absolute w-2 h-2 bg-purple-600 rounded-full -top-0.75 -right-1"></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Direct</div>
                    </div>

                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">
                        {formatTime(selectedFlight.arrival.scheduled)}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center justify-center">
                        <FiMapPin className="mr-1" />
                        {selectedFlight.arrival.airport}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <FiClock className="text-gray-500 mr-1" />
                    <span className="text-sm text-gray-500">
                      Flight duration:{" "}
                      {calculateDuration(selectedFlight.departure.scheduled, selectedFlight.arrival.scheduled)}
                    </span>
                  </div>
                  <div className="text-xl font-bold text-purple-600">₹{selectedFlight.price.toLocaleString()}</div>
                </div>
              </div>

              <form onSubmit={handleCheckout}>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Passenger Information</h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={passenger.name}
                        onChange={handleInputChange}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={passenger.email}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={passenger.phone}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      placeholder="9876543210"
                      required
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-2 flex items-center">
                    <FiCreditCard className="mr-2 text-purple-600" />
                    Payment Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Base fare</span>
                      <span>₹{(selectedFlight.price - 1200).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Taxes & fees</span>
                      <span>₹1,200</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200 font-bold">
                      <span>Total Amount</span>
                      <span className="text-purple-600">₹{selectedFlight.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={paymentProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70"
                >
                  {paymentProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Pay Now ₹" + selectedFlight.price.toLocaleString()
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>This is a secure payment process. Your payment information is encrypted.</p>
          <p className="mt-1">By proceeding with the payment, you agree to our terms and conditions.</p>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage

