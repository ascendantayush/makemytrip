// backend_new/src/models/Success.js
import mongoose from 'mongoose';

const successSchema = new mongoose.Schema({
  razorpay_order_id: { type: String, required: true },
  razorpay_payment_id: { type: String, required: false },
  user: { type: String, required: true },
}, {
  timestamps: true
});

const Success = mongoose.model('Success', successSchema);

export default Success;