const mongoose = require("mongoose");

const friendListSchema = new mongoose.Schema(
  {
    friends: [
      {
        type: Number,
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

friendListSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});

const FriendList = mongoose.model("FriendList", friendListSchema);

module.exports = FriendList;
