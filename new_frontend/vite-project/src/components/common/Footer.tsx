import { Link } from "react-router-dom"
import { FiMail, FiPhone, FiMapPin, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi"
import { FaFacebookF } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="bg-white text-purple-600 p-1 rounded mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                </svg>
              </span>
              SkyQuest
            </h3>
            <p className="text-gray-300 mb-4">
              Your journey to extraordinary destinations begins with us. Experience seamless flight bookings with
              SkyQuest.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                <FaFacebookF className="text-white" size={18} />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                <FiTwitter className="text-white" size={18} />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                <FiInstagram className="text-white" size={18} />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                <FiLinkedin className="text-white" size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-purple-500 pb-2">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="bg-purple-500/20 p-1 rounded mr-2">→</span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/flights/search"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <span className="bg-purple-500/20 p-1 rounded mr-2">→</span>
                  Find Flights
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="bg-purple-500/20 p-1 rounded mr-2">→</span>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="bg-purple-500/20 p-1 rounded mr-2">→</span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-purple-500 pb-2">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="bg-purple-500/20 p-1 rounded mr-2">→</span>
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="bg-purple-500/20 p-1 rounded mr-2">→</span>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="bg-purple-500/20 p-1 rounded mr-2">→</span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="bg-purple-500/20 p-1 rounded mr-2">→</span>
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-purple-500 pb-2">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FiMapPin className="mt-1 text-purple-400 flex-shrink-0" />
                <span className="text-gray-300">123 Sky Tower, Cloud City, Airland</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="text-purple-400 flex-shrink-0" />
                <span className="text-gray-300">+1 234 567 8900</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="text-purple-400 flex-shrink-0" />
                <span className="text-gray-300">info@skyquest.com</span>
              </li>
            </ul>
            <div className="mt-6 bg-white/10 rounded-lg p-4">
              <p className="text-sm text-gray-300">Subscribe to our newsletter for exclusive deals and updates</p>
              <div className="mt-2 flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-grow bg-white/10 border border-purple-500/30 rounded-l-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-r-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-800/50 mt-10 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} SkyQuest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

