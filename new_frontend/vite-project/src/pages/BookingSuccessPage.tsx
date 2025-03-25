"use client"

import { useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { FiCheckCircle, FiHome, FiUser } from "react-icons/fi"

const BookingSuccessPage = () => {
  useEffect(() => {
    // Clear selected flight from session storage
    sessionStorage.removeItem("selectedFlight")
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 flex flex-col items-center justify-center text-white">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="bg-white/20 backdrop-blur-sm p-4 rounded-full mb-4"
              >
                <FiCheckCircle className="text-white text-4xl" />
              </motion.div>
              <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
              <p className="text-purple-100 text-center mt-2">Your flight has been successfully booked</p>
            </div>

            <div className="p-8">
              <div className="mb-8">
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
                  <p className="text-green-800 text-sm flex items-center">
                    <FiCheckCircle className="mr-2 text-green-600" />A confirmation email has been sent to your
                    registered email address.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Booking Reference:</span>
                    <span className="font-medium text-gray-900 bg-purple-50 px-3 py-1 rounded-full text-sm">
                      SKY{Math.floor(Math.random() * 1000000)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Link
                  to="/profile"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex justify-center items-center"
                >
                  <FiUser className="mr-2" />
                  View My Bookings
                </Link>
                <Link
                  to="/"
                  className="w-full bg-white border border-purple-600 text-purple-600 py-3 rounded-lg font-medium hover:bg-purple-50 transition-all duration-300 flex justify-center items-center"
                >
                  <FiHome className="mr-2" />
                  Back to Home
                </Link>
              </div>

              <div className="mt-8 text-center">
                <div className="inline-block bg-purple-50 px-4 py-2 rounded-full">
                  <p className="text-purple-700 text-sm">Thank you for choosing SkyQuest!</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default BookingSuccessPage

