import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCreditCard, FiUser, FiCalendar, FiAlertCircle } from "react-icons/fi";

// Utility functions
interface Passenger {
  name: string;
  email: string;
  phone: string;
}

interface Flight {
  departure: {
    scheduled: string;
    airport: string;
  };
  arrival: {
    scheduled: string;
    airport: string;
  };
  airline: {
    name: string;
  };
  flight: {
    iata: string;
  };
  price: number;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

interface FormatTime {
  (dateString: string): string;
}

const formatTime: FormatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).toUpperCase();
};

interface CalculateDuration {
  (departureTime: string, arrivalTime: string): string;
}

const calculateDuration: CalculateDuration = (departureTime, arrivalTime) => {
  const departure = new Date(departureTime);
  const arrival = new Date(arrivalTime);
  
  const durationMs = arrival.getTime() - departure.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};

const CheckoutPage = () => {
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [passengers, setPassengers] = useState([{ name: "", email: "", phone: "" }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login?redirect=checkout");
      return;
    }

    // Retrieve selected flight from session storage
    const flightData = sessionStorage.getItem("selectedFlight");
    if (!flightData) {
      navigate("/search");
      return;
    }

    try {
      const flight = JSON.parse(flightData);
      setSelectedFlight(flight);
    } catch (err) {
      console.error("Error parsing flight data:", err);
      navigate("/search");
    }
  }, [navigate]);

  interface PassengerFieldChangeHandler {
    (index: number, field: keyof Passenger, value: string): void;
  }

  const handlePassengerChange: PassengerFieldChangeHandler = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengers(updatedPassengers);
  };

  const addPassenger = () => {
    setPassengers([...passengers, { name: "", email: "", phone: "" }]);
  };

  interface RemovePassenger {
    (index: number): void;
  }

  const removePassenger: RemovePassenger = (index) => {
    if (passengers.length > 1) {
      const updatedPassengers = [...passengers];
      updatedPassengers.splice(index, 1);
      setPassengers(updatedPassengers);
    }
  };

  const validatePassengers = () => {
    for (const passenger of passengers) {
      if (!passenger.name || !passenger.email || !passenger.phone) {
        return false;
      }
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validatePassengers()) {
      setError("Please fill in all passenger details");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login?redirect=checkout");
        return;
      }

      // Create order on backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          flightDetails: selectedFlight,
          passengers,
          totalAmount: selectedFlight ? selectedFlight.price * passengers.length : 0,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to create order");
      }

      // Initialize Razorpay
      interface RazorpayOptions {
        key: string;
        amount: number;
        currency: string;
        name: string;
        description: string;
        order_id: string;
        handler: (response: RazorpayResponse) => Promise<void>;
        prefill: {
          name: string;
          email: string;
          contact: string;
        };
        theme: {
          color: string;
        };
      }

      interface RazorpayResponse {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }

      const options: RazorpayOptions = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "SkyQuest",
        description: selectedFlight ? `Flight from ${selectedFlight.departure.airport} to ${selectedFlight.arrival.airport}` : '',
        order_id: data.order.id,
        handler: async function (response: RazorpayResponse) {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderId: data.orderId,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Clear selected flight from session storage
              sessionStorage.removeItem("selectedFlight");
              // Navigate to success page
              navigate(`/booking-success/${data.orderId}`);
            } else {
              setError("Payment verification failed. Please try again.");
            }
          } catch (err) {
            console.error("Error verifying payment:", err);
            setError("Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: passengers[0].name,
          email: passengers[0].email,
          contact: passengers[0].phone,
        },
        theme: {
          color: "#6366F1",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Error processing payment:", err);
      setError("Failed to process payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedFlight) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-purple-600 hover:text-purple-800 mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back to search results
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Flight details and passenger forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Flight details card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
                <h2 className="text-2xl font-bold mb-2">Flight Details</h2>
                <div className="flex items-center text-white/80">
                  <FiCalendar className="mr-2" />
                  <span>{formatDate(selectedFlight.departure.scheduled)}</span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      {/* <FiPlane className="text-purple-600 text-xl" /> */}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{selectedFlight.airline.name}</h3>
                      <p className="text-gray-600 text-sm">Flight {selectedFlight.flight.iata}</p>
                    </div>
                  </div>
                  <div className="bg-purple-50 px-4 py-2 rounded-lg">
                    <span className="font-medium text-purple-700">
                      ₹{selectedFlight.price.toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-sm"> / person</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between border-t border-gray-100 pt-6">
                  <div className="mb-4 md:mb-0">
                    <p className="text-sm text-gray-500">Departure</p>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold mr-2">
                        {formatTime(selectedFlight.departure.scheduled)}
                      </span>
                      <span className="text-gray-700">{selectedFlight.departure.airport}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center mb-4 md:mb-0">
                    <div className="text-gray-400 text-sm mb-1">
                      {calculateDuration(
                        selectedFlight.departure.scheduled,
                        selectedFlight.arrival.scheduled
                      )}
                    </div>
                    <div className="w-32 h-0.5 bg-gray-300 relative">
                      <div className="absolute -top-1.5 left-0 w-3 h-3 rounded-full bg-purple-600"></div>
                      <div className="absolute -top-1.5 right-0 w-3 h-3 rounded-full bg-purple-600"></div>
                    </div>
                    <div className="text-gray-500 text-sm mt-1">Direct</div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Arrival</p>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold mr-2">
                        {formatTime(selectedFlight.arrival.scheduled)}
                      </span>
                      <span className="text-gray-700">{selectedFlight.arrival.airport}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger forms */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
                <h2 className="text-2xl font-bold mb-2">Passenger Information</h2>
                <div className="flex items-center text-white/80">
                  <FiUser className="mr-2" />
                  <span>{passengers.length} passenger(s)</span>
                </div>
              </div>

              <div className="p-6">
                {passengers.map((passenger, index) => (
                  <div key={index} className={`${index > 0 ? "mt-8 pt-8 border-t border-gray-200" : ""}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-lg flex items-center">
                        <FiUser className="mr-2 text-purple-600" />
                        Passenger {index + 1}
                      </h3>
                      {passengers.length > 1 && (
                        <button
                          onClick={() => removePassenger(index)}
                          className="text-gray-400 hover:text-red-500"
                          aria-label="Remove passenger"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`name-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id={`name-${index}`}
                          value={passenger.name}
                          onChange={(e) => handlePassengerChange(index, "name", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter full name as on ID"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor={`email-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id={`email-${index}`}
                          value={passenger.email}
                          onChange={(e) => handlePassengerChange(index, "email", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="email@example.com"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor={`phone-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id={`phone-${index}`}
                          value={passenger.phone}
                          onChange={(e) => handlePassengerChange(index, "phone", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter 10-digit mobile number"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addPassenger}
                  className="mt-4 text-purple-600 hover:text-purple-800 font-medium flex items-center"
                >
                  + Add another passenger
                </button>
              </div>
            </div>
          </div>

          {/* Right column - Price breakdown and payment */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 sticky top-24">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
                <h2 className="text-2xl font-bold mb-2">Price Summary</h2>
                <div className="flex items-center text-white/80">
                  <FiCreditCard className="mr-2" />
                  <span>Secure payment</span>
                </div>
              </div>

              <div className="p-6">
                {/* Price Breakdown */}
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base fare ({passengers.length} passenger{passengers.length > 1 ? 's' : ''})</span>
                    <span className="font-medium">₹{(selectedFlight.price * passengers.length).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & fees</span>
                    <span className="font-medium">₹{Math.round(selectedFlight.price * passengers.length * 0.05).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Convenience fee</span>
                    <span className="font-medium">₹{Math.round(selectedFlight.price * passengers.length * 0.02).toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg">
                      ₹{Math.round(selectedFlight.price * passengers.length * 1.07).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Payment Section */}
                <div className="mt-6">
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600">
                        You'll be redirected to Razorpay's secure payment gateway to complete your purchase.
                      </p>
                      <div className="flex items-center mt-3 space-x-2">
                        <img src="/razorpay-logo.png" alt="Razorpay" className="h-6" />
                        <span className="text-xs text-gray-500">Secured by Razorpay</span>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-start">
                      <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      `Pay ₹${Math.round(selectedFlight.price * passengers.length * 1.07).toLocaleString()}`
                    )}
                  </button>

                  <p className="mt-4 text-xs text-gray-500 text-center">
                    By clicking the button above, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;