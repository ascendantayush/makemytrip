"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { FiCalendar, FiMapPin, FiSearch, FiArrowRight, FiX } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { airportService } from "../../services/api"

const searchSchema = z.object({
  departureAirport: z.string().min(3, "Please enter a valid airport code or city"),
  arrivalAirport: z.string().min(3, "Please enter a valid airport code or city"),
})

type SearchFormData = z.infer<typeof searchSchema>

interface Airport {
  iata: string
  name: string
  city: string
  country: string
}

const FlightSearch = () => {
  const [departureDate, setDepartureDate] = useState<Date | null>(new Date())
  const [isLoading, setIsLoading] = useState(false)
  const [departureQuery, setDepartureQuery] = useState("")
  const [arrivalQuery, setArrivalQuery] = useState("")
  const [departureAirports, setDepartureAirports] = useState<Airport[]>([])
  const [arrivalAirports, setArrivalAirports] = useState<Airport[]>([])
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false)
  const [showArrivalSuggestions, setShowArrivalSuggestions] = useState(false)
  const [selectedDepartureAirport, setSelectedDepartureAirport] = useState<Airport | null>(null)
  const [selectedArrivalAirport, setSelectedArrivalAirport] = useState<Airport | null>(null)
  const departureRef = useRef<HTMLDivElement>(null)
  const arrivalRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (departureRef.current && !departureRef.current.contains(event.target as Node)) {
        setShowDepartureSuggestions(false)
      }
      if (arrivalRef.current && !arrivalRef.current.contains(event.target as Node)) {
        setShowArrivalSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const searchAirports = async (query: string, isArrival: boolean) => {
      if (query.length < 2) {
        isArrival ? setArrivalAirports([]) : setDepartureAirports([])
        return
      }

      try {
        const response = await airportService.searchAirports(query)
        if (response && response.data) {
          if (isArrival) {
            setArrivalAirports(response.data.slice(0, 5))
          } else {
            setDepartureAirports(response.data.slice(0, 5))
          }
        }
      } catch (error) {
        console.error("Error searching airports:", error)

        // Fallback to loading from airports.json
        try {
          const res = await fetch("/airports.json")
          const mockAirports: Airport[] = await res.json()
          const filteredAirports = mockAirports.filter(
            (airport) =>
              airport.iata.toLowerCase().includes(query.toLowerCase()) ||
              airport.city.toLowerCase().includes(query.toLowerCase()) ||
              airport.name.toLowerCase().includes(query.toLowerCase())
          )

          if (isArrival) {
            setArrivalAirports(filteredAirports.slice(0, 5))
          } else {
            setDepartureAirports(filteredAirports.slice(0, 5))
          }
        } catch (jsonError) {
          console.error("Error loading airports.json:", jsonError)
        }
      }
    }

    const debounce = setTimeout(() => {
      if (departureQuery) {
        searchAirports(departureQuery, false)
      }
      if (arrivalQuery) {
        searchAirports(arrivalQuery, true)
      }
    }, 300)

    return () => clearTimeout(debounce)
  }, [departureQuery, arrivalQuery])

  const handleDepartureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDepartureQuery(value)
    setValue("departureAirport", value)
    setShowDepartureSuggestions(true)
    setSelectedDepartureAirport(null)
  }

  const handleArrivalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setArrivalQuery(value)
    setValue("arrivalAirport", value)
    setShowArrivalSuggestions(true)
    setSelectedArrivalAirport(null)
  }

  const selectDepartureAirport = (airport: Airport) => {
    setSelectedDepartureAirport(airport)
    setDepartureQuery(`${airport.city} (${airport.iata})`)
    setValue("departureAirport", airport.iata)
    setShowDepartureSuggestions(false)
  }

  const selectArrivalAirport = (airport: Airport) => {
    setSelectedArrivalAirport(airport)
    setArrivalQuery(`${airport.city} (${airport.iata})`)
    setValue("arrivalAirport", airport.iata)
    setShowArrivalSuggestions(false)
  }

  const clearDepartureInput = () => {
    setDepartureQuery("")
    setValue("departureAirport", "")
    setSelectedDepartureAirport(null)
  }

  const clearArrivalInput = () => {
    setArrivalQuery("")
    setValue("arrivalAirport", "")
    setSelectedArrivalAirport(null)
  }


  const onSubmit = async (data: SearchFormData) => {
    try {
      setIsLoading(true)

      // Format the date as YYYY-MM-DD
      const formattedDate = departureDate
        ? departureDate.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0]

      // Use the IATA code from selected airport or the raw input
      const fromCode = selectedDepartureAirport ? selectedDepartureAirport.iata : data.departureAirport
      const toCode = selectedArrivalAirport ? selectedArrivalAirport.iata : data.arrivalAirport

      // Navigate to search results with query params
      navigate(`/flights/search?from=${fromCode}&to=${toCode}&date=${formattedDate}`)
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
          <div className="space-y-2" ref={departureRef}>
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
                className={`w-full pl-10 pr-10 py-3 border ${errors.departureAirport ? "border-red-500" : "border-gray-300"} rounded-lg text-blue-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                placeholder="City or airport code"
                value={departureQuery}
                onChange={handleDepartureChange}
                onFocus={() => setShowDepartureSuggestions(true)}
              />
              {departureQuery && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={clearDepartureInput}
                >
                  <FiX className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            {errors.departureAirport && <p className="text-red-500 text-sm mt-1">{errors.departureAirport.message}</p>}

            {/* Airport suggestions */}
            {showDepartureSuggestions && departureAirports.length > 0 && (
              <div className="absolute z-10 mt-1 w-1/2 bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-auto">
                {departureAirports.map((airport, index) => (
                  <div
                    key={`${airport.iata}-${index}`}
                    className="px-4 py-2 hover:bg-purple-50 cursor-pointer flex items-start border-b border-gray-100 last:border-0"
                    onClick={() => selectDepartureAirport(airport)}
                  >
                    <div className="bg-purple-100 p-1 rounded-full mr-2 mt-1">
                      <FiMapPin className="text-purple-600 text-sm" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {airport.city} ({airport.iata})
                      </div>
                      <div className="text-xs text-gray-500">
                        {airport.name}, {airport.country}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2 relative" ref={arrivalRef}>
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
                className={`w-full pl-10 pr-10 py-3 border ${errors.arrivalAirport ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none text-blue-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                placeholder="City or airport code"
                value={arrivalQuery}
                onChange={handleArrivalChange}
                onFocus={() => setShowArrivalSuggestions(true)}
              />
              {arrivalQuery && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={clearArrivalInput}
                >
                  <FiX className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            {errors.arrivalAirport && <p className="text-red-500 text-sm mt-1">{errors.arrivalAirport.message}</p>}

            {/* Airport suggestions */}
            {showArrivalSuggestions && arrivalAirports.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-auto">
                {arrivalAirports.map((airport, index) => (
                  <div
                    key={`${airport.iata}-${index}`}
                    className="px-4 py-2 hover:bg-purple-50 cursor-pointer flex items-start border-b border-gray-100 last:border-0"
                    onClick={() => selectArrivalAirport(airport)}
                  >
                    <div className="bg-purple-100 p-1 rounded-full mr-2 mt-1">
                      <FiMapPin className="text-purple-600 text-sm" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {airport.city} ({airport.iata})
                      </div>
                      <div className="text-xs text-gray-500">
                        {airport.name}, {airport.country}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Arrow between inputs (visible on mobile) */}
            <div className="md:hidden absolute -left-4 top-1/2 transform -translate-y-1/2 -translate-x-full">
              <div className="bg-purple-100 p-2 rounded-full">
                <FiArrowRight className="text-purple-500" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 text-blue-900">
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
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-blue-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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

