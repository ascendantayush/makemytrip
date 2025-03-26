"use client"

import { motion } from "framer-motion"
import type { Flight } from "../../types"
import { FiClock, FiCalendar, FiMapPin, FiArrowRight } from "react-icons/fi"
import { formatDate, formatTime, calculateDuration } from "../../utils/dateUtils"

interface FlightCardProps {
  flight: Flight
  onSelect: (flight: Flight) => void
}

const FlightCard = ({ flight, onSelect }: FlightCardProps) => {
  const departureTime = new Date(flight.departure.scheduled)
  const arrivalTime = new Date(flight.arrival.scheduled)
  const duration = calculateDuration(departureTime, arrivalTime)
  const price = flight.price || Math.floor(Math.random() * (15000 - 5000) + 5000)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <img
                src={`/download.jpg?height=30&width=30&text=${flight.airline.name.charAt(0)}`}
                alt={flight.airline.name}
                className="h-6 w-6 object-contain"
              />
            </div>
            <div>
              <span className="font-semibold text-gray-900">{flight.airline.name}</span>
              <span className="text-sm text-gray-500 block">({flight.flight.iata})</span>
            </div>
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            <FiCalendar className="mr-1 text-purple-500" />
            {formatDate(departureTime)}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{formatTime(departureTime)}</p>
            <p className="text-sm font-medium text-gray-900 mt-1">{flight.departure.iata}</p>
            <div className="flex items-center justify-center text-xs text-gray-500 mt-1">
              <FiMapPin className="mr-1 text-purple-500" />
              <span className="truncate max-w-[120px]">{flight.departure.airport}</span>
            </div>
          </div>

          <div className="flex-1 mx-4 relative">
            <div className="border-t-2 border-gray-300 border-dashed absolute w-full top-1/2 transform -translate-y-1/2"></div>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-purple-500"></div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-indigo-500"></div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3 py-1 rounded-full border border-purple-200 shadow-sm">
              <div className="text-xs text-gray-600 flex items-center whitespace-nowrap">
                <FiClock className="mr-1 text-purple-500" />
                {duration}
              </div>
            </div>

            <div className="absolute -bottom-6 w-full text-center">
              <div className="text-xs font-medium px-2 py-12 rounded-full inline-block">
                <span
                  className={`${
                    flight.flight_status === "scheduled" ? "text-green-600 bg-green-50" : "text-orange-600 bg-orange-50"
                  } px-2 -py-8 rounded-full`}
                >
                  {flight.flight_status === "scheduled" ? "On Time" : flight.flight_status}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{formatTime(arrivalTime)}</p>
            <p className="text-sm font-medium text-gray-900 mt-1">{flight.arrival.iata}</p>
            <div className="flex items-center justify-center text-xs text-gray-500 mt-1">
              <FiMapPin className="mr-1 text-indigo-500" />
              <span className="truncate max-w-[120px]">{flight.arrival.airport}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div>
            <p className="text-2xl font-bold text-gray-900">₹{price.toLocaleString()}</p>
            <p className="text-xs text-gray-500">per person</p>
          </div>
          <button
            onClick={() => onSelect(flight)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex items-center"
          >
            Select
            <FiArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default FlightCard

