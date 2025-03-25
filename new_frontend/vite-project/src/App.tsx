import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "./context/AuthContext"
import MainLayout from "./layout/MainLayout"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import FlightSearchPage from "./pages/FlightSearchPage"
import CheckoutPage from "./pages/CheckoutPage"
import BookingSuccessPage from "./pages/BookingSuccessPage"
import AboutPage from "./pages/AboutPage"
import ContactPage from "./pages/ContactPage"
import ProfilePage from "./pages/ProfilePage"

function App() {
  return (
    <Router>
      <AuthProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/flights/search" element={<FlightSearchPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/booking-success" element={<BookingSuccessPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </MainLayout>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#333",
              color: "#fff",
              borderRadius: "8px",
            },
          }}
        />
      </AuthProvider>
    </Router>
  )
}

export default App

