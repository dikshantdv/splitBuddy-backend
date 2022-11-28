const mongoose = require("mongoose");

const amountSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "A Transaction must have a amount"],
      trim: true,
    },
    transactionId: { type: mongoose.Schema.ObjectId, ref: "Transaction" },
    creatorId: { type: String, ref: "User" },
    type: {
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

amountSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});

const Amount = mongoose.model("Amount", amountSchema);

module.exports = Amount;
