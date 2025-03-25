"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { Flight } from "../../types"
import { useAuth } from "../../context/AuthContext"
import { checkoutService, paymentService } from "../../services/api"
import { formatDate, formatTime } from "../../utils/dateUtils"
import { FiUser, FiMail, FiPhone, FiCreditCard, FiCalendar, FiMapPin, FiClock, FiDollarSign } from "react-icons/fi"
import { useNavigate } from "react-router-dom"

const passengerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
})

type PassengerFormData = z.infer<typeof passengerSchema>

interface CheckoutFormProps {
  flight: Flight
  price: number
}

declare global {
  interface Window {
    Razorpay: any
  }
}

const CheckoutForm = ({ flight, price }: CheckoutFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PassengerFormData>({
    resolver: zodResolver(passengerSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.mobile?.toString() || "",
    },
  })

  const calculateDuration = (departure: Date, arrival: Date): string => {
    const durationMs = arrival.getTime() - departure.getTime()
    const durationMinutes = Math.floor(durationMs / (1000 * 60))
    const hours = Math.floor(durationMinutes / 60)
    const minutes = durationMinutes % 60

    return `${hours}h ${minutes}m`
  }

  const onSubmit = async (data: PassengerFormData) => {
    if (!user) {
      navigate("/login")
      return
    }

    try {
      setIsLoading(true)

      // Create checkout record
      const checkoutData = {
        price: {
          base_fare: price * 0.8,
          surcharges: price * 0.2,
        },
        date: flight.flight_date,
        user: user._id,
      }

      await checkoutService.createCheckout(checkoutData)

      // Create Razorpay order
      const paymentData = {
        params: {
          price: price,
        },
      }

      const order = await paymentService.createPayment(paymentData)

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "SkyQuest",
        description: `Flight from ${flight.departure.iata} to ${flight.arrival.iata}`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // Save payment success
            const successData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              user: user._id,
            }

            await paymentService.confirmPayment(successData)

            // Create order record
            await checkoutService.createCheckout({
              ...checkoutData,
              user: user._id,
            })

            navigate("/booking-success")
          } catch (error) {
            console.error("Payment confirmation error:", error)
          }
        },
        prefill: {
          name: data.name,
          email: data.email,
          contact: data.phone,
        },
        theme: {
          color: "#7C3AED",
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error("Checkout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <h2 className="text-xl font-bold flex items-center">
            <FiCalendar className="mr-2" />
            Flight Details
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <FiMapPin className="text-purple-600" />
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Airline</span>
                  <p className="font-medium text-gray-900">
                    {flight.airline.name} ({flight.flight.iata})
                  </p>
                </div>
              </div>
              <div className="bg-purple-50 px-3 py-1 rounded-full text-sm font-medium text-purple-700">
                {flight.flight_status === "scheduled" ? "On Time" : flight.flight_status}
              </div>
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <FiCalendar className="text-purple-600" />
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Date</span>
                  <p className="font-medium text-gray-900">{formatDate(new Date(flight.flight_date))}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-full mr-3 mt-1">
                  <FiMapPin className="text-purple-600" />
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Departure</span>
                  <p className="font-medium text-gray-900">{formatTime(new Date(flight.departure.scheduled))}</p>
                  <p className="text-gray-700 text-sm">
                    {flight.departure.airport} ({flight.departure.iata})
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-full mr-3 mt-1">
                  <FiMapPin className="text-indigo-600" />
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Arrival</span>
                  <p className="font-medium text-gray-900">{formatTime(new Date(flight.arrival.scheduled))}</p>
                  <p className="text-gray-700 text-sm">
                    {flight.arrival.airport} ({flight.arrival.iata})
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <FiClock className="text-purple-600" />
              </div>
              <div>
                <span className="text-gray-500 text-sm">Duration</span>
                <p className="font-medium text-gray-900">
                  {calculateDuration(new Date(flight.departure.scheduled), new Date(flight.arrival.scheduled))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <h2 className="text-xl font-bold flex items-center">
            <FiDollarSign className="mr-2" />
            Price Details
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-gray-600">Base Fare</span>
              <span className="font-medium text-gray-900">₹{Math.floor(price * 0.8).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-gray-600">Taxes & Fees</span>
              <span className="font-medium text-gray-900">₹{Math.floor(price * 0.2).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-gray-900">₹{price.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <h2 className="text-xl font-bold flex items-center">
            <FiUser className="mr-2" />
            Passenger Information
          </h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  className={`w-full pl-10 pr-3 py-3 border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                  placeholder="John Doe"
                  {...register("name")}
                />
              </div>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  className={`w-full pl-10 pr-3 py-3 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                  placeholder="your@email.com"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="text-gray-400" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  className={`w-full pl-10 pr-3 py-3 border ${errors.phone ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                  placeholder="1234567890"
                  {...register("phone")}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FiCreditCard className="mr-2" />
                  <span>Proceed to Payment</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CheckoutForm

