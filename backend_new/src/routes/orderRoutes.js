import express from 'express';
import Order from '../models/Order.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

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

// @desc    Get order by ID
// @route   GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token',
      });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
    
    // Check if the order belongs to the logged-in user
    if (order.user.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order',
      });
    }
    
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message,
    });
  }
});

export default router;