const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema(
  {
    // AddedDate=21/10/2022isOnline:true
    amount: {
      type: Number,
      required: [true, "A Transaction must have a amount"],
      trim: true,
    },
    friendId: {
      type: String,
      ref: "User",
    },
    isOnline: {
      type: Boolean,
      default: true,
    },
    addedDate: {
      type: Date,
      default: new Date().toJSON().slice(0, 10),
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

const Friend = mongoose.model("Friend", friendSchema);

module.exports = Friend;
