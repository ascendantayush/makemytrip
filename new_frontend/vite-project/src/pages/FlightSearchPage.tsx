"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import type { Flight } from "../types"
import { flightService } from "../services/api"
import FlightSearch from "../components/flight/FlightSearch"
import FlightCard from "../components/flight/FlightCard"
import { useNavigate } from "react-router-dom"
import { FiFilter, FiArrowUp, FiArrowDown, FiAlertCircle } from "react-icons/fi"

const FlightSearchPage = () => {
  const [searchParams] = useSearchParams()
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"price" | "departure" | "duration">("price")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const navigate = useNavigate()

  const from = searchParams.get("from") || ""
  const to = searchParams.get("to") || ""
  const date = searchParams.get("date") || ""

  useEffect(() => {
    const fetchFlights = async () => {
      if (!from || !to || !date) return

      try {
        setLoading(true)
        setError(null)

        const response = await flightService.searchFlights({
          departureAirport: from,
          arrivalAirport: to,
          date: date,
        })

        if (response.data && response.data.length > 0) {
          // Add random prices to flights for demo purposes
          const flightsWithPrices = response.data.map((flight: Flight) => ({
            ...flight,
            price: Math.floor(Math.random() * (15000 - 5000) + 5000),
          }))
          setFlights(flightsWithPrices)
        } else {
          setFlights([])
          setError("No flights found for the selected route and date.")
        }
      } catch (err) {
        console.error("Error fetching flights:", err)
        setError("Failed to fetch flights. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchFlights()
  }, [from, to, date])

  const handleSelectFlight = (flight: Flight) => {
    // Store selected flight in session storage
    sessionStorage.setItem("selectedFlight", JSON.stringify(flight))
    navigate("/checkout")
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  const sortedFlights = [...flights].sort((a, b) => {
    if (sortBy === "price") {
      const priceA = a.price ?? 0;
      const priceB = b.price ?? 0;
      return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
    } else if (sortBy === "departure") {
      const dateA = new Date(a.departure.scheduled).getTime()
      const dateB = new Date(b.departure.scheduled).getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    } else {
      // duration
      const durationA = new Date(a.arrival.scheduled).getTime() - new Date(a.departure.scheduled).getTime()
      const durationB = new Date(b.arrival.scheduled).getTime() - new Date(b.departure.scheduled).getTime()
      return sortOrder === "asc" ? durationA - durationB : durationB - durationA
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Find Your Flight</h1>
          <FlightSearch />
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <h2 className="text-2xl font-bold flex items-center">
                {/* <FiPlane className="mr-2" /> */}
                <span>{from}</span>
                <span className="mx-2">→</span>
                <span>{to}</span>
              </h2>
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5">
                  <span className="mr-2 text-white">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-white border-none focus:outline-none focus:ring-0 text-sm"
                  >
                    <option value="price" className="text-gray-900">
                      Price
                    </option>
                    <option value="departure" className="text-gray-900">
                      Departure Time
                    </option>
                    <option value="duration" className="text-gray-900">
                      Duration
                    </option>
                  </select>
                  <button onClick={toggleSortOrder} className="ml-2 text-white hover:text-purple-200">
                    {sortOrder === "asc" ? <FiArrowUp /> : <FiArrowDown />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center text-white/80 mt-4">
              <FiFilter className="mr-2" />
              <span>
                Showing {sortedFlights.length} flights on {date}
              </span>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-16">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 font-medium">Searching for the best flights...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-6 rounded-lg flex items-start">
                <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{error}</p>
                  <p className="text-sm mt-1">Please try different search criteria or contact customer support.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedFlights.length > 0 ? (
                  sortedFlights.map((flight, index) => (
                    <FlightCard key={`${flight.flight.iata}-${index}`} flight={flight} onSelect={handleSelectFlight} />
                  ))
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-purple-50 inline-block p-4 rounded-full mb-4">
                      {/* <FiPlane className="text-purple-500 text-3xl" /> */}
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No Flights Found</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      We couldn't find any flights matching your search criteria. Try adjusting your search parameters.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlightSearchPage

