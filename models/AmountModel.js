const mongoose = require("mongoose");

const amountSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      trim: true,
      default: 0,
    },
    between: [
      {
        type: String,
        ref: "User",
      },
    ],
    creatorId: {
      type: String,
      ref: "User",
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
