const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const FriendList = require("../models/FriendListModel");
const Transaction = require("../models/TransactionModel");

exports.sendOtp = catchAsync(async (req, res, next) => {
  // if (req.body.otp != 1234) {
  //   return next(new AppError("Incorrect Otp", 401));
  // }
  // let user = await User.findById(req.body._id);
  // if (user) {
  //   return res.status(201).json({
  //     status: "already exists",
  //     user,
  //   });
  // } else {
  //   const friendList = await FriendList.create({});
  //   user = await User.create({
  //     _id: req.body._id,
  //     name: req.body.name,
  //     friends: friendList._id,
  //   });
  // }

  res.status(201).json({
    status: "success",
    user,
  });
});

exports.verifyOtp = catchAsync(async (req, res, next) => {
  if (req.body.otp != parseInt(req.body._id / 1000000)) {
    return next(new AppError("Incorrect Otp", 401));
  }
  let user = await User.findById(req.body._id);
  if (user) {
    return res.status(201).json({
      status: "already exists",
      user,
    });
  } else {
    res.status(201).json({
      status: "success",
    });
  }
});
exports.createUser = catchAsync(async (req, res, next) => {
  const friendList = await FriendList.create({});
  const user = await User.create({
    _id: req.body._id,
    name: req.body.name,
    friendsId: friendList._id,
  });
  res.status(201).json({
    status: "success",
    user,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  let user = await User.findById(req.body._id);
  if (!user) {
    return next(new AppError("No user exsits with such id", 401));
  } else {
    user = await user.update({
      name: req.body.name,
    });
  }

  res.status(201).json({
    status: "success",
    user,
  });
});

exports.AddFriend = catchAsync(async (req, res, next) => {
  //find by id and update lagana h $push k sath
  let friendListMine = await FriendList.findById(req.body.friendsId);
  let friendListFriend = await FriendList.findById(req.body.friendsIdFriend);
  if (!friendListMine || !friendListFriend) {
    return next(new AppError("No friend list exsits with such id", 401));
  } else {
    friendListMine = await friendListMine.update({
      friends: [req.body.oppositeId, ...friendListMine.friends],
    });
    friendListFriend = await friendListFriend.update({
      friends: [req.body._id, ...friendListFriend.friends],
    });
    // let transacObj = {
    //   creator: req.body._id,
    //   between: [req.body._id, req.body.friendsId],
    // }
    // if(req.body.type==="split"){
    //   transacObj.type=req.body.type,
    //   transacObj.name=req.body.name,
    // }
    const transaction = await Transaction.create({
      creator: req.body._id,
      between: [req.body._id, req.body.oppositeId],
    });
  }

  res.status(201).json({
    status: "success",
  });
});

exports.getFriends = catchAsync(async (req, res, next) => {
  const friendList = await FriendList.findById(req.params.friendsId).populate({
    path: "friends",
    select: "name id _id DpUrl",
  });
  res.status(201).json({
    status: "success",
    friendList,
  });
});
