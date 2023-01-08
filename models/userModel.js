const mongoose = require("mongoose");
const FriendList = require("./FriendListModel");

const userSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: {
      type: String,
      required: [true, "A User must have a name"],
      trim: true,
    },
    friendsId: { type: mongoose.Schema.ObjectId, ref: "FriendList" },
    willGet: { type: Number, default: 0 },
    willGive: { type: Number, default: 0 },
    DpUrl: {
      type: String,
      default:
        "https://api.time.com/wp-content/uploads/2019/08/better-smartphone-photos.jpg",
    },
    DpId: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

userSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
