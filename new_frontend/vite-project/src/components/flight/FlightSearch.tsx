"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { FiCalendar, FiMapPin, FiSearch, FiArrowRight } from "react-icons/fi"
import { useNavigate } from "react-router-dom"

const searchSchema = z.object({
  departureAirport: z.string().min(3, "Please enter a valid airport code"),
  arrivalAirport: z.string().min(3, "Please enter a valid airport code"),
})

type SearchFormData = z.infer<typeof searchSchema>

const FlightSearch = () => {
  const [departureDate, setDepartureDate] = useState<Date | null>(new Date())
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
  })

  const onSubmit = async (data: SearchFormData) => {
    try {
      setIsLoading(true)

      // Format the date as YYYY-MM-DD
      const formattedDate = departureDate
        ? departureDate.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0]

      // Navigate to search results with query params
      navigate(`/flights/search?from=${data.departureAirport}&to=${data.arrivalAirport}&date=${formattedDate}`)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="departureAirport" className="block text-sm font-medium text-gray-700">
              From
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMapPin className="text-purple-500" />
              </div>
              <input
                id="departureAirport"
                type="text"
                className={`w-full pl-10 pr-3 py-3 border ${errors.departureAirport ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                placeholder="Airport code (e.g. DEL)"
                {...register("departureAirport")}
              />
            </div>
            {errors.departureAirport && <p className="text-red-500 text-sm mt-1">{errors.departureAirport.message}</p>}
          </div>

          <div className="space-y-2 relative">
            <label htmlFor="arrivalAirport" className="block text-sm font-medium text-gray-700">
              To
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMapPin className="text-purple-500" />
              </div>
              <input
                id="arrivalAirport"
                type="text"
                className={`w-full pl-10 pr-3 py-3 border ${errors.arrivalAirport ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                placeholder="Airport code (e.g. BOM)"
                {...register("arrivalAirport")}
              />
            </div>
            {errors.arrivalAirport && <p className="text-red-500 text-sm mt-1">{errors.arrivalAirport.message}</p>}

            {/* Arrow between inputs (visible on mobile) */}
            <div className="md:hidden absolute -left-4 top-1/2 transform -translate-y-1/2 -translate-x-full">
              <div className="bg-purple-100 p-2 rounded-full">
                <FiArrowRight className="text-purple-500" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700">
              Departure Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="text-purple-500" />
              </div>
              <DatePicker
                id="departureDate"
                selected={departureDate}
                onChange={(date) => setDepartureDate(date)}
                minDate={new Date()}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                dateFormat="yyyy-MM-dd"
                placeholderText="Select date"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-full flex items-center space-x-2 hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-medium"
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
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <FiSearch />
                <span>Search Flights</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default FlightSearch

