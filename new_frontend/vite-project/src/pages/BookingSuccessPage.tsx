import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiCheck, FiDownload, FiCalendar, FiUser } from "react-icons/fi";

// Utility functions
interface FormatDate {
  (dateString: string): string;
}

const formatDate: FormatDate = (dateString) => {
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

const BookingSuccessPage = () => {
  const { orderId } = useParams();
  interface Order {
    razorpayOrderId: string;
    flight: {
      departureTime: string;
      arrivalTime: string;
      departureAirport: string;
      arrivalAirport: string;
      airline: string;
      flightNumber: string;
    };
    passengers: {
      name: string;
      email: string;
      phone: string;
    }[];
    razorpayPaymentId: string;
    paymentStatus: string;
    totalAmount: number;
    createdAt: string;
  }

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch order details");
        }

        setOrder(data.order);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-8 text-center">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <FiCheck className="text-red-600 text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Booking</h1>
            <p className="text-gray-600 mb-6">{error || "Something went wrong"}</p>
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-8 text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <FiCheck className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-white/80">
              Your booking has been confirmed and your ticket is ready.
            </p>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Booking Reference</h2>
                <p className="text-gray-600">{order.razorpayOrderId}</p>
              </div>
              <button className="flex items-center text-purple-600 hover:text-purple-800">
                <FiDownload className="mr-2" />
                Download Ticket
              </button>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Flight Details</h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div className="mb-4 md:mb-0">
                    <p className="text-sm text-gray-500 flex items-center">
                      <FiCalendar className="mr-2" />
                      {formatDate(order.flight.departureTime)}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-2xl font-bold mr-2">
                        {formatTime(order.flight.departureTime)}
                      </span>
                      <span className="text-gray-700">{order.flight.departureAirport}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center mb-4 md:mb-0">
                    <div className="text-gray-400 text-sm mb-1">
                      {calculateDuration(
                        order.flight.departureTime,
                        order.flight.arrivalTime
                      )}
                    </div>
                    <div className="w-32 h-0.5 bg-gray-300 relative">
                      <div className="absolute -top-1.5 left-0 w-3 h-3 rounded-full bg-purple-600"></div>
                      <div className="absolute -top-1.5 right-0 w-3 h-3 rounded-full bg-purple-600"></div>
                    </div>
                    <div className="text-gray-500 text-sm mt-1">Direct</div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 flex items-center">
                      <FiCalendar className="mr-2" />
                      {formatDate(order.flight.arrivalTime)}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-2xl font-bold mr-2">
                        {formatTime(order.flight.arrivalTime)}
                      </span>
                      <span className="text-gray-700">{order.flight.arrivalAirport}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="bg-white px-3 py-1.5 rounded border border-gray-200">
                    <span className="text-gray-500">Airline:</span>{" "}
                    <span className="font-medium">{order.flight.airline}</span>
                  </div>
                  <div className="bg-white px-3 py-1.5 rounded border border-gray-200">
                    <span className="text-gray-500">Flight:</span>{" "}
                    <span className="font-medium">{order.flight.flightNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Passenger Information</h3>
              <div className="space-y-4">
                {order.passengers.map((passenger, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <FiUser className="text-purple-600 mr-2" />
                      <h4 className="font-medium">Passenger {index + 1}</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Name:</span>{" "}
                        <span className="font-medium">{passenger.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>{" "}
                        <span className="font-medium">{passenger.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>{" "}
                        <span className="font-medium">{passenger.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium mb-4">Payment Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Payment ID:</span>{" "}
                    <span className="font-medium">{order.razorpayPaymentId}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>{" "}
                    <span className="font-medium text-green-600">
                      {order.paymentStatus === "completed" ? "Paid" : order.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Amount:</span>{" "}
                    <span className="font-medium">₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Date:</span>{" "}
                    <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/"
                className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;