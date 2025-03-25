// backend_new/src/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
// Import routes
import userRoutes from './routes/userRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import successRoutes from './routes/successRoutes.js';
import authRoutes from './routes/auth.js'
// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all origins

// Routes
app.get('/', (req, res) => res.send('API is running...'));
app.use('/users', userRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/order', orderRoutes);
app.use('/razorpay', paymentRoutes);
app.use('/success', successRoutes);
app.use("/api/auth", authRoutes)

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