"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import type { Flight } from "../types"
import CheckoutForm from "../components/payment/CheckoutForm"
import { useAuth } from "../context/AuthContext"
import { FiArrowLeft, FiShoppingBag } from "react-icons/fi"
import { Link } from "react-router-dom"

const CheckoutPage = () => {
  const [flight, setFlight] = useState<Flight | null>(null)
  const [price, setPrice] = useState(0)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    // Get selected flight from session storage
    const selectedFlight = sessionStorage.getItem("selectedFlight")
    if (!selectedFlight) {
      navigate("/flights/search")
      return
    }

    const parsedFlight = JSON.parse(selectedFlight)
    setFlight(parsedFlight)

    // Get price (in a real app, this would come from the API)
    setPrice(parsedFlight.price || Math.floor(Math.random() * (15000 - 5000) + 5000))
  }, [isAuthenticated, navigate])

  if (!flight) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/flights/search" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-8">
          <FiArrowLeft className="mr-2" />
          Back to Flight Search
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-full mr-4">
              <FiShoppingBag className="text-white text-xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Booking</h1>
          </div>

          <CheckoutForm flight={flight} price={price} />
        </motion.div>
      </div>
    </div>
  )
}

export default CheckoutPage

