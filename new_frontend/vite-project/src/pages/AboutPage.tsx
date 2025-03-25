"use client"

import { motion } from "framer-motion"
import { FiUsers, FiAward, FiGlobe, FiStar } from "react-icons/fi"

const AboutPage = () => {
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
          About{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">SkyQuest</span>
        </motion.h1>
        <motion.p
          className="text-lg text-gray-600 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          We're on a mission to make air travel accessible, affordable, and enjoyable for everyone. Our innovative
          platform connects travelers with the best flight options worldwide.
        </motion.p>
      </motion.div>

      {/* Our Story Section */}
      <motion.div
        className="grid md:grid-cols-2 gap-12 items-center mb-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Founded in 2020, SkyQuest began with a simple idea: make flight booking transparent and stress-free. What
            started as a small startup has grown into a trusted platform used by thousands of travelers worldwide.
          </p>
          <p className="text-gray-600 mb-4">
            Our team of travel enthusiasts and tech experts work tirelessly to bring you the most comprehensive flight
            search experience, with real-time pricing, honest reviews, and personalized recommendations.
          </p>
          <p className="text-gray-600">
            We believe that travel should be accessible to everyone, and we're committed to making that vision a
            reality.
          </p>
        </motion.div>
        <motion.div variants={itemVariants} className="rounded-xl overflow-hidden shadow-xl">
          <img src="/placeholder.svg?height=400&width=600" alt="SkyQuest team" className="w-full h-full object-cover" />
        </motion.div>
      </motion.div>

      {/* Values Section */}
      <motion.div
        className="mb-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Values</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            These core principles guide everything we do at SkyQuest.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <FiUsers />,
              title: "Customer First",
              description: "We put our customers at the center of everything we do.",
            },
            {
              icon: <FiAward />,
              title: "Excellence",
              description: "We strive for excellence in every aspect of our service.",
            },
            { icon: <FiGlobe />, title: "Global Mindset", description: "We embrace diversity and think globally." },
            {
              icon: <FiStar />,
              title: "Innovation",
              description: "We constantly innovate to improve the travel experience.",
            },
          ].map((value, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-white text-xl mb-4">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Team Section */}
      <motion.div
        className="mb-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            The passionate people behind SkyQuest who make your travel dreams come true.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: "Alex Johnson", role: "CEO & Founder", image: "/placeholder.svg?height=300&width=300" },
            { name: "Sarah Chen", role: "CTO", image: "/placeholder.svg?height=300&width=300" },
            {
              name: "Michael Rodriguez",
              role: "Head of Customer Experience",
              image: "/placeholder.svg?height=300&width=300",
            },
          ].map((member, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <img src={member.image || "/placeholder.svg"} alt={member.name} className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                <p className="text-purple-600">{member.role}</p>
              </div>
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

export default AboutPage

