const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    creator: {
      type: Number,
      required: [true, "A Transaction must have creator"],
      ref: "User",
    },
    between: [
      {
        type: Number,
        required: [true, "A Transaction must have members"],
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

transactionSchema.virtual("amounts", {
  ref: "Amount",
  foreignField: "transactionId",
  localField: "_id",
});

transactionSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
