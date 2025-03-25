"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../../context/AuthContext"
import { FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Flights", path: "/flights/search" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-md shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg mr-2">
                {/* <FiPlane className="text-white text-xl" /> */}
              </div>
              <span className="text-2xl font-bold text-gray-800">SkyQuest</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-8">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`text-base font-medium hover:text-purple-500 transition-colors relative ${
                      location.pathname === link.path ? "text-purple-500" : "text-gray-800"
                    }`}
                  >
                    {link.name}
                    {location.pathname === link.path && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-[-5px] left-0 right-0 h-0.5 bg-purple-500"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-base font-medium text-gray-800 hover:text-purple-500"
                  >
                    <div className="bg-purple-100 p-1.5 rounded-full">
                      <FiUser className="text-purple-600" />
                    </div>
                    <span>{user?.name}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 text-base font-medium text-gray-800 hover:text-purple-500"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-base font-medium text-gray-800 hover:text-purple-500">
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full text-base font-medium hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-800 hover:text-purple-500 focus:outline-none">
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 pb-4 space-y-4">
                <ul className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className={`block text-base font-medium hover:text-purple-500 transition-colors ${
                          location.pathname === link.path ? "text-purple-500" : "text-gray-800"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-gray-200">
                  {isAuthenticated ? (
                    <div className="flex flex-col space-y-4">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 text-base font-medium text-gray-800 hover:text-purple-500"
                        onClick={() => setIsOpen(false)}
                      >
                        <FiUser />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setIsOpen(false)
                        }}
                        className="flex items-center space-x-2 text-base font-medium text-gray-800 hover:text-purple-500"
                      >
                        <FiLogOut />
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-4">
                      <Link
                        to="/login"
                        className="text-base font-medium text-gray-800 hover:text-purple-500"
                        onClick={() => setIsOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full text-base font-medium text-center"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar

