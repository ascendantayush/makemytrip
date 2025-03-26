import express from "express"
import crypto from "crypto"
import Razorpay from "razorpay"
import { authenticateToken } from "../middleware/auth.js"
import Order from "../models/Order.js"
import Booking from "../models/Booking.js"

const router = express.Router()

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// Create a new order
router.post("/create-order", authenticateToken, async (req, res) => {
  try {
    const { amount, currency, receipt, flightDetails, passengerDetails } = req.body

    // Create order with Razorpay
    const options = {
      amount,
      currency,
      receipt,
      payment_capture: 1, // Auto-capture payment
    }

    const razorpayOrder = await razorpay.orders.create(options)

    // Save order to database
    const order = new Order({
      user: req.user.id,
      razorpayOrderId: razorpayOrder.id,
      amount: amount / 100, // Convert back to rupees for storage
      currency,
      receipt,
      status: "created",
      flightDetails,
      passengerDetails,
    })

    await order.save()

    res.status(200).json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt,
    })
  } catch (error) {
    console.error("Order creation error:", error)
    res.status(500).json({ message: "Failed to create order" })
  }
})

// Verify payment
router.post("/verify-payment", authenticateToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex")

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" })
    }

    // Find and update order
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id })
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    order.razorpayPaymentId = razorpay_payment_id
    order.razorpaySignature = razorpay_signature
    order.status = "paid"
    await order.save()

    // Create booking
    const bookingReference = `SKY${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`

    const booking = new Booking({
      user: req.user.id,
      orderId: order._id,
      bookingReference,
      status: "confirmed",
      flightDetails: order.flightDetails,
      passengerDetails: order.passengerDetails,
    })

    await booking.save()

    res.status(200).json({
      message: "Payment verified successfully",
      bookingId: bookingReference,
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    res.status(500).json({ message: "Failed to verify payment" })
  }
})

// Get user's bookings
router.get("/bookings", authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.status(200).json(bookings)
  } catch (error) {
    console.error("Get bookings error:", error)
    res.status(500).json({ message: "Failed to fetch bookings" })
  }
})

export default router

