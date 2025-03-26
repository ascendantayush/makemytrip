import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    bookingReference: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
    flightDetails: {
      flightNumber: String,
      departure: String,
      arrival: String,
      departureTime: Date,
      arrivalTime: Date,
    },
    passengerDetails: {
      name: String,
      email: String,
      phone: String,
    },
  },
  {
    timestamps: true,
  },
)

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema)

export default Booking

