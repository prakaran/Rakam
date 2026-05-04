const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["CREDIT", "DEBIT", "TRANSFER"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "SUCCESS",
    },
    description: {
      type: String,
    },
  },
  { timestamps: true },
);

TransactionSchema.index({ from: 1, createdAt: -1 });
TransactionSchema.index({ to: 1, createdAt: -1 });

module.exports = mongoose.model("Transaction", TransactionSchema);
