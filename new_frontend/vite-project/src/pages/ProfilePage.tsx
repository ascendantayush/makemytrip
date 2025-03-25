"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiEdit,
  FiShield,
  FiCreditCard,
  FiMapPin,
  FiAirplay,
  FiBookmark,
} from "react-icons/fi"

interface UserProfile {
  _id: string
  name: string
  email: string
  mobile: string
  createdAt: string
  isVerified: boolean
}

const ProfilePage = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true)
        const token = localStorage.getItem("token")

        if (!token) {
          throw new Error("No authentication token found")
        }

        const response = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch profile data")
        }

        const data = await response.json()
        setProfile(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("Error fetching profile:", err)
      } finally {
        setProfileLoading(false)
      }
    }

    if (isAuthenticated && !isLoading) {
      fetchProfile()
    } else if (!isLoading && !isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, isLoading, navigate])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  if (isLoading || profileLoading) {
    return (
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading your profile...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center bg-red-100 p-3 rounded-full mb-4">
            <FiShield className="text-red-500 text-2xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Your{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Profile</span>
        </motion.h1>
        <motion.p
          className="text-lg text-gray-600 max-w-3xl mx-auto"
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
        <motion.div className="md:col-span-1" variants={containerVariants} initial="hidden" animate="visible">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 sticky top-24"
          >
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white text-center">
              <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm p-6 rounded-full mb-4">
                <FiUser className="text-white text-4xl" />
              </div>
              <h2 className="text-2xl font-bold">{profile?.name}</h2>
              <p className="text-purple-100 mt-1">{profile?.email}</p>
              {profile?.isVerified && (
                <div className="inline-flex items-center mt-2 bg-green-500/20 px-3 py-1 rounded-full">
                  <FiShield className="text-green-100 mr-1" />
                  <span className="text-sm text-green-100">Verified Account</span>
                </div>
              )}
            </div>

            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <FiMail className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800">{profile?.email}</p>
                  </div>
                </li>
                <li className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <FiPhone className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-800">{profile?.mobile}</p>
                  </div>
                </li>
                <li className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <FiCalendar className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="text-gray-800">{profile?.createdAt ? formatDate(profile.createdAt) : "N/A"}</p>
                  </div>
                </li>
              </ul>

              <div className="mt-8">
                <motion.button
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex justify-center items-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiEdit className="mr-2" />
                  Edit Profile
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column - Dashboard */}
        <div className="md:col-span-2">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
            {/* Stats Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: <FiAirplay />, title: "Flights Booked", value: "12" },
                { icon: <FiMapPin />, title: "Destinations", value: "8" },
                { icon: <FiBookmark />, title: "Saved Trips", value: "3" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100 text-center"
                >
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-4">
                    {stat.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                </div>
              ))}
            </motion.div>

            {/* Recent Bookings */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800">Recent Bookings</h3>
              </div>

              <div className="p-6">
                {/* Sample bookings - in a real app, these would come from the API */}
                {[1, 2, 3].map((_, index) => (
                  <motion.div
                    key={index}
                    className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                    whileHover={{ backgroundColor: "#f9f7ff" }}
                  >
                    <div className="flex items-center mb-3 md:mb-0">
                      <div className="bg-purple-100 p-2 rounded-full mr-4">
                        <FiAirplay className="text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">New York to London</h4>
                        <p className="text-sm text-gray-500">May {15 + index}, 2023 • Round Trip</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end w-full md:w-auto">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        Confirmed
                      </span>
                      <button className="ml-4 text-purple-600 hover:text-purple-800 font-medium text-sm">
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}

                {/* Empty state if no bookings */}
                {false && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center bg-purple-100 p-3 rounded-full mb-4">
                      <FiAirplay className="text-purple-600 text-2xl" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-800 mb-2">No bookings yet</h4>
                    <p className="text-gray-600 mb-4">Start your journey by booking your first flight</p>
                    <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300">
                      Book a Flight
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Payment Methods */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800">Payment Methods</h3>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <FiCreditCard className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">•••• •••• •••• 4242</h4>
                      <p className="text-sm text-gray-500">Expires 12/25</p>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                    Default
                  </span>
                </div>

                <motion.button
                  className="w-full border border-purple-600 text-purple-600 py-2 rounded-lg font-medium hover:bg-purple-50 transition-all duration-300 flex justify-center items-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiCreditCard className="mr-2" />
                  Add Payment Method
                </motion.button>
              </div>
            </motion.div>

            {/* Account Security */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800">Account Security</h3>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-2 rounded-full mr-4">
                        <FiShield className="text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Password</h4>
                        <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                      </div>
                    </div>
                    <button className="text-purple-600 hover:text-purple-800 font-medium">Change</button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-2 rounded-full mr-4">
                        <FiPhone className="text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500">Enhance your account security</p>
                      </div>
                    </div>
                    <button className="text-purple-600 hover:text-purple-800 font-medium">Enable</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

