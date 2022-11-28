const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "A Transaction must have a amount"],
      trim: true,
    },
    between: [
      {
        type: String,
        required: [true, "A Transaction must have members"],
        ref: "User",
      },
    ],
    creatorId: { type: String, ref: "User" },
    type: {
      type: String,
      enum: ["gave", "got"],
    },
    transactionType: {
      type: String,
      default: "normal",
    },
    name: {
      type: String,
      default: "normal",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

transactionSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
