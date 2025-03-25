import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    checkout: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Checkout',
      },
    ],
    order: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
  },
  {
    timestamps: true, // Automatically creates `createdAt` and `updatedAt` fields
  }
);

// Add indexes explicitly
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ mobile: 1 }, { unique: true });

// Handle mongoose model registration to prevent re-registration errors
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
