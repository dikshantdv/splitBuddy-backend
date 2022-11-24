const mongoose = require("mongoose");

const splitSchema = new mongoose.Schema(
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
    amount: {
      type: String,
      required: [true, "Split must have an amount"],
    },
    name: {
      required: [true, "Split must have a name"],
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

splitSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});

const Split = mongoose.model("Split", splitSchema);

module.exports = Split;
