// backend_new/src/controllers/checkoutController.js
import Checkout from '../models/Checkout.js';
import User from '../models/User.js';

// Create a new checkout
export const createCheckout = async (req, res) => {
  try {
    const checkout = await Checkout.create(req.body);
    return res.status(201).json(checkout);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get checkout by user ID
export const getCheckoutByUser = async (req, res) => {
  try {
    const checkouts = await Checkout.find({ user: req.params.name });
    return res.status(200).json(checkouts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};