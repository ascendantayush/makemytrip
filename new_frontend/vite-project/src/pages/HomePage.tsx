"use client"

import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { motion, useAnimation, useInView } from "framer-motion"
import FlightSearch from "../components/flight/FlightSearch"
import { FiMapPin, FiClock, FiDollarSign, FiShield, FiChevronRight, FiStar } from "react-icons/fi"

const HomePage = () => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  const features = [
    {
      icon: <FiMapPin className="text-purple-500 text-2xl" />,
      title: "Global Destinations",
      description: "Access flights to over 5,000 destinations worldwide with our comprehensive network.",
    },
    {
      icon: <FiClock className="text-purple-500 text-2xl" />,
      title: "Real-time Updates",
      description: "Get instant notifications about flight status, delays, and gate changes.",
    },
    {
      icon: <FiDollarSign className="text-purple-500 text-2xl" />,
      title: "Best Price Guarantee",
      description: "We ensure you get the most competitive prices for your flight bookings.",
    },
    {
      icon: <FiShield className="text-purple-500 text-2xl" />,
      title: "Secure Booking",
      description: "Your payment and personal information are protected with industry-standard security.",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Business Traveler",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      quote:
        "SkyQuest has transformed my business travel experience. The booking process is seamless, and their customer service is exceptional.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Adventure Seeker",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      quote:
        "I've booked multiple international flights through SkyQuest, and they consistently offer the best prices and smoothest experience.",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Family Vacationer",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      quote:
        "Planning family trips is so much easier with SkyQuest. Their interface is intuitive, and they have great family package deals.",
      rating: 4,
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        {/* Background with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-indigo-900/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                Discover the World with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  SkyQuest
                </span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-lg">
                Seamless flight bookings to your dream destinations. Experience travel like never before.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/flights/search"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex items-center"
                >
                  Book Now
                  <FiChevronRight className="ml-2" />
                </Link>
                <Link
                  to="/about"
                  className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-3 rounded-full text-lg font-medium hover:bg-white/20 transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>

              <div className="mt-12 flex items-center space-x-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                      <img
                        src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${i * 10}.jpg`}
                        alt={`User ${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar key={star} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-300">Trusted by 10,000+ travelers</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl"
            >
              <div className="bg-white rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-4 px-6">
                  <h2 className="text-white text-xl font-semibold">Find Your Flight</h2>
                </div>
                <div className="p-6">
                  <FlightSearch />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.span
              variants={itemVariants}
              className="inline-block px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full mb-4"
            >
              Why Choose Us
            </motion.span>
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              The SkyQuest Advantage
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-600 text-lg">
              We offer the best flight booking experience with features designed for your convenience and peace of mind.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                className="bg-white rounded-2xl border border-gray-100 p-8 shadow-md transition-all duration-300 hover:border-purple-200"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-4 bg-purple-50 rounded-full">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full mb-4">
              Explore
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Popular Destinations</h2>
            <p className="text-gray-600 text-lg">Discover our most sought-after flight routes and dream destinations</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                city: "New York",
                country: "USA",
                price: "₹45,000",
                image:
                  "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
              },
              {
                city: "London",
                country: "UK",
                price: "₹52,000",
                image:
                  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
              },
              {
                city: "Tokyo",
                country: "Japan",
                price: "₹65,000",
                image:
                  "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
              },
              {
                city: "Paris",
                country: "France",
                price: "₹48,000",
                image:
                  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
              },
              {
                city: "Sydney",
                country: "Australia",
                price: "₹72,000",
                image:
                  "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
              },
              {
                city: "Dubai",
                country: "UAE",
                price: "₹38,000",
                image:
                  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
              },
            ].map((destination, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-lg h-80">
                  <img
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.city}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/40 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex justify-between items-end">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1">{destination.city}</h3>
                          <p className="text-gray-200">{destination.country}</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          <span className="text-white font-medium">from {destination.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/flights/search"
              className="inline-flex items-center px-6 py-3 border border-purple-600 text-purple-600 bg-white rounded-full hover:bg-purple-50 transition-colors duration-300 font-medium"
            >
              View All Destinations
              <FiChevronRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">What Our Customers Say</h2>
            <p className="text-gray-600 text-lg">
              Don't just take our word for it. Hear from our satisfied travelers around the world.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-2xl p-8 shadow-md border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <div className="mr-4">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-purple-200"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`${i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"} mr-1`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for Your Next Adventure?</h2>
            <p className="text-xl mb-8 text-purple-100">
              Book your next flight today and experience the SkyQuest difference.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/flights/search"
                className="bg-white text-purple-600 px-8 py-3 rounded-full text-lg font-medium hover:bg-purple-50 transition-all duration-300"
              >
                Book Now
              </Link>
              <Link
                to="/contact"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-white/10 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

