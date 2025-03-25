import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendOtpEmail } from "../config/nodemailer.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Register or Resend OTP
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      // If not verified, resend OTP
      if (!user.isVerified) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        await sendOtpEmail(email, otp, name);
        return res.status(200).json({
          message: "OTP resent. Please verify your email.",
        });
      }
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      otp,
      otpExpiry,
      isVerified: false,
    });

    await user.save();
    await sendOtpEmail(email, otp, name);

    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP." });
    if (new Date() > user.otpExpiry)
      return res.status(400).json({ message: "OTP expired." });

    // Mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    

    res.status(200).json({
      message: "Email verified successfully.",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    if (!user.isVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date();
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();

      await sendOtpEmail(email, otp, user.name);
      return res.status(400).json({
        message: "Email not verified. A new OTP has been sent.",
      });
    }

   const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
  expiresIn: "7d",
});


    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get Current User
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -otp -otpExpiry");
    if (!user) return res.status(404).json({ message: "User not found." });

    res.status(200).json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
