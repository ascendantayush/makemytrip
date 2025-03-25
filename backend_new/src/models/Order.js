// backend_new/src/models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  flight_date: { type: String, required: true },
  flight_status: { type: String, required: false },
  departure: {
    airport: { type: String, required: false },
    timezone: { type: String, required: false },
    iata: { type: String, required: false },
    icao: { type: String, required: false },
    terminal: { type: String, required: false },
    gate: { type: String, required: false },
    delay: { type: Number, required: false },
    scheduled: { type: String, required: false },
    estimated: { type: String, required: false },
    actual: { type: String, required: false },
    estimated_runway: { type: String, required: false },
    actual_runway: { type: String, required: false },
  },
  arrival: {
    airport: { type: String, required: false },
    timezone: { type: String, required: false },
    iata: { type: String, required: false },
    icao: { type: String, required: false },
    terminal: { type: String, required: false },
    baggage: { type: String, required: false },
    gate: { type: String, required: false },
    delay: { type: Number, required: false },
    scheduled: { type: String, required: false },
    estimated: { type: String, required: false },
    actual: { type: String, required: false },
    estimated_runway: { type: String, required: false },
    actual_runway: { type: String, required: false },
  },
  airline: {
    name: { type: String, required: false },
    iata: { type: String, required: false },
    icao: { type: String, required: false },
  },
  flight: {
    aircraft: { type: String, required: false },
    live: { type: String, required: false },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;