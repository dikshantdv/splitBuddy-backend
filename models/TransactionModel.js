const mongoose = require("mongoose");
const User = require("./userModel");

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
    creatorId: {
      type: String,
      ref: "User",
      required: [true, "a transaction must have a creator"],
    },
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

transactionSchema.statics.calcMinMaxPrice = async function (transacData) {
  let withId = transacData.between.find((id) => id !== transacData.creatorId);
  const creator = await User.findById(transacData.creatorId).snapshot();
  const reciever = await User.findById(withId).snapshot();
  if (transacData.type === "gave") {
    creator.willGet = creator.willGet + transacData.amount;
    creator.save();
    reciever.willGive = reciever.willGive + transacData.amount;
    reciever.save();
  } else {
    reciever.willGet = reciever.willGet + transacData.amount;
    reciever.save();
    creator.willGive = creator.willGive + transacData.amount;
    creator.save();
  }
};

transactionSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});

transactionSchema.post("save", function () {
  this.constructor.calcMinMaxPrice(this);
});
const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
