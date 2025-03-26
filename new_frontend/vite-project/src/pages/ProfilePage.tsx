"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  Bookmark,
  Calendar,
  CreditCard,
  Edit,
  Mail,
  MapPin,
  Phone,
  Plane,
  Shield,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  createdAt: string;
  isVerified: boolean;
}

interface Booking {
  _id: string;
  bookingReference: string;
  status: string;
  createdAt: string;
  flightDetails: {
    flightNumber: string;
    departure: string;
    arrival: string;
    departureTime: string;
    arrivalTime: string;
  };
  passengerDetails: {
    name: string;
    email: string;
    phone: string;
  };
}

const ProfilePage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found");
        }
        const response = await fetch(`${API_URL}/api/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching profile:", err);
      } finally {
        setProfileLoading(false);
      }
    };

    if (isAuthenticated && !isLoading) {
      fetchProfile();
    } else if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Fetch bookings data
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setBookingsLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(`${API_URL}/api/payment/bookings`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bookings data");
        }

        const data = await response.json();
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        // Don't set error state here to avoid blocking the profile display
      } finally {
        setBookingsLoading(false);
      }
    };

    if (isAuthenticated && !isLoading) {
      fetchBookings();
    }
  }, [isAuthenticated, isLoading]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-t-4 border-sky-400 animate-spin"></div>
            <div className="absolute inset-3 rounded-full border-2 border-sky-200 opacity-30"></div>
          </div>
          <p className="mt-4 text-sky-400 font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center bg-red-900/40 p-3 rounded-full mb-4">
            <AlertCircle className="text-red-400 text-2xl" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Error Loading Profile
          </h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-sky-500 hover:bg-sky-400 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Your{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-600">
            Profile
          </span>
        </motion.h1>
        <motion.p
          className="text-lg text-slate-300 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Manage your account details and view your travel history
        </motion.p>
      </motion.div>

      {/* Profile Content */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column - User Info Card */}
        <motion.div
          className="md:col-span-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-700 sticky top-24"
          >
            <div className="bg-gradient-to-r from-sky-600 to-blue-600 p-8 text-white text-center">
              <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm p-6 rounded-full mb-4">
                <User className="text-white text-4xl" />
              </div>
              <h2 className="text-2xl font-bold">{profile?.name}</h2>
              <p className="text-sky-100 mt-1">{profile?.email}</p>
              {profile?.isVerified && (
                <div className="inline-flex items-center mt-2 bg-green-500/20 px-3 py-1 rounded-full">
                  <Shield className="text-green-100 mr-1" size={14} />
                  <span className="text-sm text-green-100">
                    Verified Account
                  </span>
                </div>
              )}
            </div>

            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="bg-sky-400/10 p-2 rounded-full mr-3">
                    <Mail className="text-sky-400" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Email</p>
                    <p className="text-white">{profile?.email}</p>
                  </div>
                </li>
                <li className="flex items-center">
                  <div className="bg-sky-400/10 p-2 rounded-full mr-3">
                    <Phone className="text-sky-400" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Phone</p>
                    <p className="text-white">{profile?.mobile}</p>
                  </div>
                </li>
                <li className="flex items-center">
                  <div className="bg-sky-400/10 p-2 rounded-full mr-3">
                    <Calendar className="text-sky-400" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Member Since</p>
                    <p className="text-white">
                      {profile?.createdAt
                        ? formatDate(profile.createdAt)
                        : "N/A"}
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-8">
                <motion.button
                  className="w-full bg-sky-500 hover:bg-sky-400 text-white py-3 rounded-lg font-medium transition-all duration-300 flex justify-center items-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Edit className="mr-2" size={18} />
                  Edit Profile
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column - Dashboard */}
        <div className="md:col-span-2">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Stats Cards */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              {[
                {
                  icon: <Plane />,
                  title: "Flights Booked",
                  value: bookings.length.toString(),
                },
                {
                  icon: <MapPin />,
                  title: "Destinations",
                  value: new Set(
                    bookings.map((booking) => booking.flightDetails.arrival)
                  ).size.toString(),
                },
                { icon: <Bookmark />, title: "Saved Trips", value: "3" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-slate-700 text-center"
                >
                  <div className="bg-gradient-to-r from-sky-600 to-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-4">
                    {stat.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-slate-400 text-sm">{stat.title}</p>
                </div>
              ))}
            </motion.div>

            {/* Recent Bookings */}
            <motion.div
              variants={itemVariants}
              className="bg-slate-800 rounded-xl shadow-md border border-slate-700 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-700">
                <h3 className="text-xl font-semibold text-white">
                  Recent Bookings
                </h3>
              </div>

              <div className="p-6">
                {bookingsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 relative">
                      <div className="absolute inset-0 rounded-full border-t-2 border-sky-400 animate-spin"></div>
                    </div>
                  </div>
                ) : bookings.length > 0 ? (
                  bookings.map((booking, index) => (
                    <motion.div
                      key={booking._id}
                      className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg ${
                        index % 2 === 0 ? "bg-slate-700/50" : "bg-slate-800"
                      }`}
                      whileHover={{
                        backgroundColor: "rgba(14, 165, 233, 0.1)",
                      }}
                    >
                      <div className="flex items-center mb-3 md:mb-0">
                        <div className="bg-sky-400/10 p-2 rounded-full mr-4">
                          <Plane className="text-sky-400" size={18} />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">
                            {booking.flightDetails.departure} to{" "}
                            {booking.flightDetails.arrival}
                          </h4>
                          <p className="text-sm text-slate-400">
                            {formatDate(booking.flightDetails.departureTime)} •{" "}
                            {booking.flightDetails.flightNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end w-full md:w-auto">
                        <span className="bg-green-900/40 text-green-400 text-xs px-2 py-1 rounded-full font-medium">
                          {booking.status}
                        </span>
                        <button className="ml-4 text-sky-400 hover:text-sky-300 font-medium text-sm">
                          View Details
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center bg-sky-400/10 p-3 rounded-full mb-4">
                      <Plane className="text-sky-400 text-2xl" />
                    </div>
                    <h4 className="text-lg font-medium text-white mb-2">
                      No bookings yet
                    </h4>
                    <p className="text-slate-400 mb-4">
                      Start your journey by booking your first flight
                    </p>
                    <button className="bg-gradient-to-r from-sky-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                      Book a Flight
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Payment Methods */}
            <motion.div
              variants={itemVariants}
              className="bg-slate-800 rounded-xl shadow-md border border-slate-700 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-700">
                <h3 className="text-xl font-semibold text-white">
                  Payment Methods
                </h3>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg mb-4">
                  <div className="flex items-center">
                    <div className="bg-sky-400/10 p-2 rounded-full mr-4">
                      <CreditCard className="text-sky-400" size={18} />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">
                        •••• •••• •••• 4242
                      </h4>
                      <p className="text-sm text-slate-400">Expires 12/25</p>
                    </div>
                  </div>
                  <span className="bg-green-900/40 text-green-400 text-xs px-2 py-1 rounded-full font-medium">
                    Default
                  </span>
                </div>

                <motion.button
                  className="w-full border border-sky-500 text-sky-400 py-2 rounded-lg font-medium hover:bg-sky-500/10 transition-all duration-300 flex justify-center items-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CreditCard className="mr-2" size={18} />
                  Add Payment Method
                </motion.button>
              </div>
            </motion.div>

            {/* Account Security */}
            <motion.div
              variants={itemVariants}
              className="bg-slate-800 rounded-xl shadow-md border border-slate-700 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-700">
                <h3 className="text-xl font-semibold text-white">
                  Account Security
                </h3>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-sky-400/10 p-2 rounded-full mr-4">
                        <Shield className="text-sky-400" size={18} />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Password</h4>
                        <p className="text-sm text-slate-400">
                          Last changed 3 months ago
                        </p>
                      </div>
                    </div>
                    <button className="text-sky-400 hover:text-sky-300 font-medium">
                      Change
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-sky-400/10 p-2 rounded-full mr-4">
                        <Phone className="text-sky-400" size={18} />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">
                          Two-Factor Authentication
                        </h4>
                        <p className="text-sm text-slate-400">
                          Enhance your account security
                        </p>
                      </div>
                    </div>
                    <button className="text-sky-400 hover:text-sky-300 font-medium">
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
