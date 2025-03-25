// backend_new/src/controllers/userController.js
import User from '../models/User.js';

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    // Validate input data
    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for duplicate email or mobile
    const existingUser = await User.findOne({ 
      $or: [{ email }, { mobile }] 
    });

    if (existingUser) {
      return res.status(409).json({
        message: `User with ${
          existingUser.email === email ? "email" : "mobile"
        } already exists.`,
      });
    }

    // Create the user
    const user = await User.create({ name, email, password, mobile });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().lean();
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.find({ _id: req.params.id });
    if (!user.length) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};