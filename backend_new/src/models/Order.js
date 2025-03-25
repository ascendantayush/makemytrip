import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    flight: {
      flightNumber: { type: String, required: true },
      airline: { type: String, required: true },
      departureAirport: { type: String, required: true },
      arrivalAirport: { type: String, required: true },
      departureTime: { type: Date, required: true },
      arrivalTime: { type: Date, required: true },
      price: { type: Number, required: true },
    },
    passengers: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
      }
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;