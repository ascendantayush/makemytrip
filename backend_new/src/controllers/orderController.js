// backend_new/src/controllers/orderController.js
import Order from '../models/Order.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get orders by user ID
export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.name });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};