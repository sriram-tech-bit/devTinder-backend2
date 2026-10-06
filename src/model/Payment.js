const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentId: {
      type: String,
    },
    amount: {
      type: Number,
      required: true, // in paise
    },
    currency: {
      type: String,
      default: "INR",
    },
    receipt: {
      type: String,
    },
    planType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["created", "captured", "failed"],
      default: "created",
    },
    notes: {
      firstName: { type: String },
      lastName: { type: String },
      emailId: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);