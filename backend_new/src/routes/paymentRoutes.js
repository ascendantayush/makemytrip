import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Simple auth check
const getUserFromToken = async (req) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { _id: decoded.id };
  } catch (error) {
    return null;
  }
};

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
router.post('/create-order', async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token',
      });
    }
    
    const { flightDetails, passengers, totalAmount } = req.body;
    
    // Create a new order in our database
    const order = new Order({
      user: user._id,
      flight: {
        flightNumber: flightDetails.flight.iata,
        airline: flightDetails.airline.name,
        departureAirport: flightDetails.departure.airport,
        arrivalAirport: flightDetails.arrival.airport,
        departureTime: flightDetails.departure.scheduled,
        arrivalTime: flightDetails.arrival.scheduled,
        price: flightDetails.price,
      },
      passengers,
      totalAmount,
      paymentStatus: 'pending',
    });
    
    await order.save();
    
    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: order._id.toString(),
    });
    
    // Update our order with Razorpay order ID
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();
    
    res.status(200).json({
      success: true,
      order: razorpayOrder,
      orderId: order._id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
});

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
router.post('/verify', async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token',
      });
    }
    
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;
    
    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');
    
    const isSignatureValid = generatedSignature === razorpaySignature;
    
    if (isSignatureValid) {
      // Update order status
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }
      
      order.paymentStatus = 'completed';
      order.razorpayPaymentId = razorpayPaymentId;
      order.razorpaySignature = razorpaySignature;
      await order.save();
      
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        order,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid signature',
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message,
    });
  }
});

export default router;