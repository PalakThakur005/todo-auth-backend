import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    cardNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate card per user
// cardSchema.index({ user: 1 }, { unique: true });

export const Card =  mongoose.model("Card", cardSchema);