"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { FiMail, FiMapPin, FiPhone, FiSend } from "react-icons/fi"

const ContactPage = () => {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")

  // Animation variants
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus("submitting")

    // Simulate form submission
    setTimeout(() => {
      setFormStatus("success")
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormStatus("idle")
        ;(e.target as HTMLFormElement).reset()
      }, 3000)
    }, 1500)
  }

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Get in{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Touch</span>
        </motion.h1>
        <motion.p
          className="text-lg text-gray-600 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Have questions or feedback? We'd love to hear from you. Our team is always here to help.
        </motion.p>
      </motion.div>

      {/* Contact Info and Form Section */}
      <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
        {/* Contact Information */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-800 mb-8">
            Contact Information
          </motion.h2>

          <div className="space-y-6">
            {[
              { icon: <FiMapPin />, title: "Our Office", content: "123 SkyQuest Avenue, San Francisco, CA 94103, USA" },
              { icon: <FiPhone />, title: "Phone", content: "+1 (555) 123-4567" },
              { icon: <FiMail />, title: "Email", content: "support@skyquest.com" },
            ].map((item, index) => (
              <motion.div key={index} variants={itemVariants} className="flex items-start">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-white text-xl mr-4 flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-gray-600">{item.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants} className="mt-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Business Hours</h3>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Monday - Friday:</span> 9:00 AM - 6:00 PM
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Saturday:</span> 10:00 AM - 4:00 PM
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Sunday:</span> Closed
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-800 mb-6">
            Send Us a Message
          </motion.h2>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <motion.div variants={itemVariants}>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Your name"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="How can we help you?"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Your message here..."
                ></textarea>
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={formStatus === "submitting" || formStatus === "success"}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex justify-center items-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {formStatus === "idle" && (
                    <>
                      <FiSend className="mr-2" />
                      Send Message
                    </>
                  )}
                  {formStatus === "submitting" && (
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
                      Sending...
                    </>
                  )}
                  {formStatus === "success" && <span className="text-green-100">Message Sent Successfully!</span>}
                </motion.button>
              </motion.div>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Map Section */}
      <motion.div
        className="mb-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Find Us</h2>
        <div className="rounded-xl overflow-hidden shadow-lg h-96 border border-gray-200">
          {/* Replace with actual map implementation */}
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-600">Interactive Map Would Be Displayed Here</p>
          </div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        className="mb-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find quick answers to common questions about our services.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              question: "How do I change or cancel my flight?",
              answer:
                "You can change or cancel your flight by logging into your account and navigating to 'My Bookings'. Follow the prompts to modify or cancel your reservation.",
            },
            {
              question: "What is your refund policy?",
              answer:
                "Our refund policy varies depending on the airline and fare type. Generally, refundable tickets can be fully refunded, while non-refundable tickets may be eligible for partial refunds or travel credits.",
            },
            {
              question: "Do you offer customer support 24/7?",
              answer:
                "Yes, our customer support team is available 24/7 to assist you with any questions or issues you may have with your booking.",
            },
            {
              question: "How can I get the best deals on flights?",
              answer:
                "To get the best deals, we recommend booking 2-3 months in advance, being flexible with your travel dates, and subscribing to our newsletter for special promotions.",
            },
          ].map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-center text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
          Join thousands of happy travelers who have discovered the SkyQuest difference.
        </p>
        <motion.button
          className="bg-white text-purple-600 px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Book Your Flight Today
        </motion.button>
      </motion.div>
    </div>
  )
}

export default ContactPage

