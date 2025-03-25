import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, required: false },
    otpExpiry: { type: Date, required: false },
  },
  {
    timestamps: true, // Automatically creates `createdAt` and `updatedAt`
  }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ mobile: 1 }, { unique: true });

// Prevent re-registration of the model
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
