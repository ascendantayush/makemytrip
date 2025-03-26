"use client";

import type React from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  MapPin,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Flight } from "../types";

// Define passenger type
interface Passenger {
  name: string;
  email: string;
  phone: string;
}

// // Define order type
// interface Order {
//   id: string;
//   amount: number;
//   currency: string;
//   receipt: string;
// }

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passenger, setPassenger] = useState<Passenger>({
    name: "",
    email: "",
    phone: "",
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    // Retrieve selected flight from session storage
    const flightData = sessionStorage.getItem("selectedFlight");
    if (flightData) {
      setSelectedFlight(JSON.parse(flightData));
    } else {
      setError("No flight selected. Please select a flight first.");
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassenger((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const API_URL = import.meta.env.VITE_API_URL;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDuration = (departure: string, arrival: string) => {
    const departureTime = new Date(departure).getTime();
    const arrivalTime = new Date(arrival).getTime();
    const durationMs = arrivalTime - departureTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFlight) {
      setError("No flight selected");
      return;
    }

    // Validate passenger information
    if (!passenger.name || !passenger.email || !passenger.phone) {
      setError("Please fill in all passenger details");
      return;
    }

    try {
      setPaymentProcessing(true);
      setError(null);

      // Create order on the server
      const response = await fetch(`${API_URL}/api/payment/create-order`, {
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
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const orderData = await response.json();

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
            const verifyResponse = await fetch(
              `${API_URL}/api/payment/verify-payment`,
              {
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
              }
            );

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }

            const verificationData = await verifyResponse.json();

            // Navigate to success page
            navigate("/booking-success", {
              state: {
                bookingId: verificationData.bookingId,
                flightDetails: selectedFlight,
                passengerDetails: passenger,
              },
            });
          } catch (error) {
            console.error("Payment verification error:", error);
            setError("Payment verification failed. Please contact support.");
            setPaymentProcessing(false);
          }
        },
        prefill: {
          name: passenger.name,
          email: passenger.email,
          contact: passenger.phone,
        },
        theme: {
          color: "#0EA5E9",
        },
        modal: {
          ondismiss: () => {
            setPaymentProcessing(false);
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Checkout error:", error);
      setError("Failed to process payment. Please try again.");
      setPaymentProcessing(false);
    }
  };

  if (!selectedFlight && !error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-t-4 border-sky-400 animate-spin"></div>
            <div className="absolute inset-3 rounded-full border-2 border-sky-200 opacity-30"></div>
          </div>
          <p className="mt-4 text-sky-400 font-medium">
            Loading your flight details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white mt-10 xl:mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sky-400 hover:text-sky-300 transition-colors mb-8"
        >
          <ArrowLeft className="mr-2" size={18} />
          <span>Back to search results</span>
        </button>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between items-center max-w-2xl mx-auto">
            <div
              className={`flex flex-col items-center ${
                activeStep >= 1 ? "text-sky-400" : "text-slate-500"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  activeStep >= 1
                    ? "bg-sky-400 text-slate-900"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                1
              </div>
              <span className="text-sm font-medium">Flight Details</span>
            </div>
            <div
              className={`w-full max-w-[100px] h-1 ${
                activeStep >= 2 ? "bg-sky-400" : "bg-slate-700"
              }`}
            ></div>
            <div
              className={`flex flex-col items-center ${
                activeStep >= 2 ? "text-sky-400" : "text-slate-500"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  activeStep >= 2
                    ? "bg-sky-400 text-slate-900"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                2
              </div>
              <span className="text-sm font-medium">Passenger Info</span>
            </div>
            <div
              className={`w-full max-w-[100px] h-1 ${
                activeStep >= 3 ? "bg-sky-400" : "bg-slate-700"
              }`}
            ></div>
            <div
              className={`flex flex-col items-center ${
                activeStep >= 3 ? "text-sky-400" : "text-slate-500"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  activeStep >= 3
                    ? "bg-sky-400 text-slate-900"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                3
              </div>
              <span className="text-sm font-medium">Payment</span>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              className="bg-red-900/40 border border-red-500/50 rounded-lg p-4 mb-8 flex items-start"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AlertCircle
                className="text-red-400 mr-3 mt-0.5 flex-shrink-0"
                size={20}
              />
              <p className="text-red-200">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {selectedFlight && (
              <>
                <motion.div
                  className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="bg-gradient-to-r from-sky-600 to-blue-600 p-6">
                    <h2 className="text-xl font-bold flex items-center">
                      <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full mr-3">
                        {selectedFlight.flight.iata}
                      </span>
                      SkyQuest
                    </h2>
                    <div className="text-sky-100 mt-1 flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(selectedFlight.departure.scheduled)}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                      <div className="text-center md:text-left mb-6 md:mb-0">
                        <div className="text-3xl font-bold text-white">
                          {formatTime(selectedFlight.departure.scheduled)}
                        </div>
                        <div className="text-slate-400 mt-1 flex items-center justify-center md:justify-start">
                          <MapPin size={14} className="mr-1" />
                          {selectedFlight.departure.airport}
                        </div>
                      </div>

                      <div className="flex flex-col items-center px-4">
                        <div className="text-sm text-slate-400 mb-2">
                          {calculateDuration(
                            selectedFlight.departure.scheduled,
                            selectedFlight.arrival.scheduled
                          )}
                        </div>
                        <div className="relative w-32 md:w-48">
                          <div className="h-0.5 bg-slate-600 w-full"></div>
                          <div className="absolute -top-1.5 -left-1 w-3 h-3 rounded-full bg-sky-400"></div>
                          <div className="absolute -top-1.5 -right-1 w-3 h-3 rounded-full bg-sky-400"></div>
                          <motion.div
                            className="absolute -top-2 w-4 h-4"
                            initial={{ left: "0%" }}
                            animate={{ left: "100%" }}
                            transition={{
                              duration: 3,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "loop",
                              ease: "linear",
                            }}
                            style={{ translateX: "-50%" }}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M21 4H6.54C6.19 4 5.89 4.21 5.76 4.54L3 11L5.76 17.46C5.89 17.79 6.19 18 6.54 18H21C21.55 18 22 17.55 22 17V5C22 4.45 21.55 4 21 4Z"
                                fill="#0EA5E9"
                              />
                              <path
                                d="M3 11V13H5.76C6.11 13 6.41 12.79 6.54 12.46L9.3 6H6.54L3 11Z"
                                fill="#0EA5E9"
                              />
                            </svg>
                          </motion.div>
                        </div>
                        <div className="text-xs text-sky-400 mt-2 font-medium">
                          Direct Flight
                        </div>
                      </div>

                      <div className="text-center md:text-right">
                        <div className="text-3xl font-bold text-white">
                          {formatTime(selectedFlight.arrival.scheduled)}
                        </div>
                        <div className="text-slate-400 mt-1 flex items-center justify-center md:justify-end">
                          <MapPin size={14} className="mr-1" />
                          {selectedFlight.arrival.airport}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-700">
                      <div className="flex items-center text-slate-300">
                        <Clock size={16} className="text-sky-400 mr-2" />
                        <span>
                          Flight duration:{" "}
                          <span className="font-medium text-white">
                            {calculateDuration(
                              selectedFlight.departure.scheduled,
                              selectedFlight.arrival.scheduled
                            )}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold">Passenger Information</h2>
                  </div>

                  <form className="p-6 space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-slate-300 mb-2"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={passenger.name}
                        onChange={handleInputChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-slate-300 mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={passenger.email}
                        onChange={handleInputChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-slate-300 mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={passenger.phone}
                        onChange={handleInputChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                        placeholder="9876543210"
                        required
                      />
                    </div>
                  </form>
                </motion.div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 sticky top-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-xl font-bold">Price Summary</h2>
              </div>

              <div className="p-6">
                {selectedFlight && (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Base fare</span>
                      <span className="font-medium">
                        ₹{(selectedFlight.price - 1200).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Taxes & fees</span>
                      <span className="font-medium">₹1,200</span>
                    </div>
                    <div className="flex justify-between pt-4 border-t border-slate-700">
                      <span className="font-bold">Total</span>
                      <span className="text-2xl font-bold text-sky-400">
                        ₹{selectedFlight.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={handleCheckout}
                      disabled={paymentProcessing}
                      className="w-full mt-6 bg-sky-500 hover:bg-sky-400 text-white py-4 px-6 rounded-lg font-medium transition-all duration-300 disabled:opacity-70 disabled:hover:bg-sky-500 flex items-center justify-center"
                    >
                      {paymentProcessing ? (
                        <span className="flex items-center">
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
                        <span className="flex items-center">
                          Proceed to Payment
                          <ChevronRight className="ml-2" size={18} />
                        </span>
                      )}
                    </button>

                    <div className="flex items-center justify-center text-sm text-slate-400 mt-4">
                      <Shield size={14} className="mr-2" />
                      Secure payment processing
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-900/50 p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-sky-500/10 rounded-full p-2 mt-1">
                    <CheckCircle size={16} className="text-sky-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">
                      Free cancellation
                    </h3>
                    <p className="text-sm text-slate-400">
                      Cancel for free within 24 hours of booking
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
