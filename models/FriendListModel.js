const mongoose = require("mongoose");

const friendListSchema = new mongoose.Schema(
  {
    creator: {
      type: String,
      ref: "User",
      required: [true, "Creator is required"],
    },
    friends: [
      {
        type: String,
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

// friendListSchema
//   .path("friends")
//   .schemaOptions.virtual("amount")
//   .get(function () {
//     return 0;
//   });
// console.log(friendListSchema.path("friends").virtual);

friendListSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});

const FriendList = mongoose.model("FriendList", friendListSchema);

module.exports = FriendList;
