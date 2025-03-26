"use client"

import type React from "react"

import { Link } from "react-router-dom"
import { FiMail, FiPhone, FiMapPin, FiTwitter, FiInstagram, FiLinkedin, FiSend, FiArrowRight } from "react-icons/fi"
import { FaFacebookF, FaPlane } from "react-icons/fa"
import { motion } from "framer-motion"
import { useState } from "react"

const Footer = () => {
  const [email, setEmail] = useState("")

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log("Subscribed with:", email)
    setEmail("")
    // Show success message or toast notification
  }

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white pt-16 pb-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-64 h-64 rounded-full bg-indigo-500/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 1,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div variants={itemVariants}>
            <div className="flex items-center mb-4">
              <div className="bg-indigo-500/20 p-2 rounded-lg mr-2">
                <FaPlane className="h-5 w-5 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold">SkyQuest</h3>
            </div>
            <p className="text-slate-300 mb-6 text-sm">
              Your journey to extraordinary destinations begins with us. Experience seamless flight bookings with
              SkyQuest, where every journey becomes a memorable adventure.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: <FaFacebookF className="h-4 w-4" />, href: "#" },
                { icon: <FiTwitter className="h-4 w-4" />, href: "#" },
                { icon: <FiInstagram className="h-4 w-4" />, href: "#" },
                { icon: <FiLinkedin className="h-4 w-4" />, href: "#" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="bg-slate-800/50 hover:bg-indigo-500/20 p-2 rounded-full transition-colors"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 border-b border-slate-700 pb-2">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Find Flights", href: "/flights/search" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }}>
                  <Link
                    to={link.href}
                    className="text-slate-300 hover:text-white transition-colors flex items-center group"
                  >
                    <span className="bg-slate-800/50 group-hover:bg-indigo-500/20 p-1 rounded mr-2 transition-colors">
                      <FiArrowRight className="h-3 w-3" />
                    </span>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 border-b border-slate-700 pb-2">Support</h3>
            <ul className="space-y-3">
              {[
                { label: "FAQ", href: "/faq" },
                { label: "Terms & Conditions", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Refund Policy", href: "/refund" },
              ].map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }}>
                  <Link
                    to={link.href}
                    className="text-slate-300 hover:text-white transition-colors flex items-center group"
                  >
                    <span className="bg-slate-800/50 group-hover:bg-indigo-500/20 p-1 rounded mr-2 transition-colors">
                      <FiArrowRight className="h-3 w-3" />
                    </span>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 border-b border-slate-700 pb-2">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FiMapPin className="mt-1 text-indigo-400 flex-shrink-0 h-4 w-4" />
                <span className="text-slate-300 text-sm">123 Sky Tower, Cloud City, Airland</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="text-indigo-400 flex-shrink-0 h-4 w-4" />
                <span className="text-slate-300 text-sm">+1 234 567 8900</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="text-indigo-400 flex-shrink-0 h-4 w-4" />
                <span className="text-slate-300 text-sm">info@skyquest.com</span>
              </li>
            </ul>

            <div className="mt-6 bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
              <p className="text-sm text-slate-300 mb-3">Subscribe for exclusive deals and updates</p>
              <form onSubmit={handleSubmit} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-grow bg-slate-900/50 border border-slate-700 rounded-l-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <motion.button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-r-lg text-sm font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiSend className="h-4 w-4" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="border-t border-slate-800 mt-10 pt-6 text-center text-slate-400 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p>&copy; {new Date().getFullYear()} SkyQuest. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer

