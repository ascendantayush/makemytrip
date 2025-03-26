import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

// import userRoutes from './routes/userRoutes.js';

import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payment.js";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all origins

// Routes
app.get("/", (req, res) => res.send("API is running..."));
// app.use('/api/users', userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);

app.use(notFound);
app.use(errorHandler);
// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default startServer;
