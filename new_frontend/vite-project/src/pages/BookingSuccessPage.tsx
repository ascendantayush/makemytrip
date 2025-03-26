"use client"

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { FiCheck, FiDownload, FiHome, FiCalendar, FiMapPin, FiClock, FiUser, FiMail, FiPhone } from "react-icons/fi"

const BookingSuccessPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [bookingDetails, setBookingDetails] = useState<any>(null)

  useEffect(() => {
    if (location.state) {
      setBookingDetails(location.state)
    } else {
      navigate("/")
    }
  }, [location, navigate])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const calculateDuration = (departure: string, arrival: string) => {
    const departureTime = new Date(departure).getTime()
    const arrivalTime = new Date(arrival).getTime()
    const durationMs = arrivalTime - departureTime
    const hours = Math.floor(durationMs / (1000 * 60 * 60))
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  const { bookingId, flightDetails, passengerDetails } = bookingDetails

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
              <FiCheck className="text-green-500 text-3xl" />
            </div>
            <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
            <p className="text-white/80 mt-1">Your flight has been successfully booked</p>
            <div className="mt-3 inline-block bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
              Booking ID: <span className="font-mono font-bold">{bookingId}</span>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiCalendar className="mr-2 text-green-500" />
                Flight Details
              </h2>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div className="mb-4 md:mb-0">
                    <div className="text-sm text-gray-500 flex items-center mb-1">
                      <FiCalendar className="mr-1" />
                      {formatDate(flightDetails.departure.scheduled)}
                    </div>
                    <div className="text-xl font-bold text-gray-900">{flightDetails.flight.iata}</div>
                  </div>

                  <div className="flex items-center">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">
                        {formatTime(flightDetails.departure.scheduled)}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center justify-center">
                        <FiMapPin className="mr-1" />
                        {flightDetails.departure.airport}
                      </div>
                    </div>

                    <div className="mx-4 flex flex-col items-center">
                      <div className="text-xs text-gray-500 mb-1">
                        {calculateDuration(flightDetails.departure.scheduled, flightDetails.arrival.scheduled)}
                      </div>
                      <div className="w-20 h-0.5 bg-gray-300 relative">
                        <div className="absolute w-2 h-2 bg-green-500 rounded-full -top-0.75 -left-1"></div>
                        <div className="absolute w-2 h-2 bg-green-500 rounded-full -top-0.75 -right-1"></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Direct</div>
                    </div>

                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">
                        {formatTime(flightDetails.arrival.scheduled)}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center justify-center">
                        <FiMapPin className="mr-1" />
                        {flightDetails.arrival.airport}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <FiClock className="text-gray-500 mr-1" />
                    <span className="text-sm text-gray-500">
                      Flight duration:{" "}
                      {calculateDuration(flightDetails.departure.scheduled, flightDetails.arrival.scheduled)}
                    </span>
                  </div>
                  <div className="text-xl font-bold text-green-600">₹{flightDetails.price.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiUser className="mr-2 text-green-500" />
                Passenger Information
              </h2>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start">
                  <FiUser className="text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Passenger Name</div>
                    <div className="font-medium text-blue-900 py-3.5">{passengerDetails.name}</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiMail className="text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium text-blue-900 py-3.5">{passengerDetails.email}</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiPhone className="text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="font-medium text-blue-900 py-3.5">{passengerDetails.phone}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium"
              >
                <FiDownload className="mr-2" />
                Download E-Ticket
              </button>

              <button
                onClick={() => navigate("/")}
                className="flex-1 flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700"
              >
                <FiHome className="mr-2" />
                Back to Home
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Thank you for choosing SkyQuest  !</p>
          <p className="mt-1">For any assistance, please contact our customer support.</p>
        </div>
      </div>
    </div>
  )
}

export default BookingSuccessPage

