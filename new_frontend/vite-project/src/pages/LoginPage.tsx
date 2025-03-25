"use client"

import { motion } from "framer-motion"
import LoginForm from "../components/auth/LoginForm"
import { FiArrowLeft } from "react-icons/fi"
import { Link } from "react-router-dom"

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-8">
          <FiArrowLeft className="mr-2" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <LoginForm />
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage

