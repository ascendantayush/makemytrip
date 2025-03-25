// backend_new/src/models/Payment.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  razorpayDetails: {
    orderId: { type: String },
    paymentId: { type: String },
    signature: { type: String },
  },
  success: { type: Boolean },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;