// backend_new/src/models/Checkout.js
import mongoose from 'mongoose';

const checkoutSchema = new mongoose.Schema({
  price: {
    base_fare: { type: Number, required: true },
    surcharges: { type: Number, required: true },
  },
  date: { type: String },
  user: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

const Checkout = mongoose.model('Checkout', checkoutSchema);

export default Checkout;