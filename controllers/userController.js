const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const FriendList = require("../models/FriendListModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const Transaction = require("../models/TransactionModel");
const Amount = require("../models/AmountModel");

const signToken = (_id, friendsId) => {
  return jwt.sign({ _id, friendsId }, process.env.JWT_SECRET_KEY);
};

// const createSendToken = (user, statusCode, res) => {
//   res.status(statusCode).json({
//     status: "success",
//     token,
//     user,
//   });
// };

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
  if (req.body.otp != parseInt(+req.body._id / 1000000)) {
    return next(new AppError("Incorrect Otp", 401));
  }
  let user = await User.findOne({ _id: req.body._id });
  console.log(user);
  if (user) {
    const token = signToken(user._id, user.friendsId);
    return res.status(201).json({
      status: "already exists",
      token,
      user,
    });
  } else {
    res.status(201).json({
      status: "success",
    });
  }
});
exports.createUser = catchAsync(async (req, res, next) => {
  const friendList = await FriendList.create({ creator: req.body._id });
  const user = await User.create({
    _id: req.body._id,
    name: req.body.name,
    friendsId: friendList._id,
  });
  const token = signToken(user._id, user.friendsId);

  res.status(201).json({
    status: "success",
    token,
    user: user,
  });
});

exports.getMoneyData = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id, { willGet: 1, willGive: 1 });

  res.status(201).json({
    status: "success",
    user,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  let user = await User.findById(req.user._id);
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
  let friendListMine = await FriendList.findById(req.user.friendsId);
  let friendListFriend = await FriendList.findById(req.body.friendsIdFriend);
  if (!friendListMine || !friendListFriend) {
    return next(new AppError("No friend list exsits with such id", 401));
  } else {
    friendListMine = await friendListMine.update({
      friends: [req.body.oppositeId, ...friendListMine.friends],
    });
    friendListFriend = await friendListFriend.update({
      friends: [req.user._id, ...friendListFriend.friends],
    });
  }
  await Amount.create({
    creatorId: req.user._id,
    between: [req.user._id, req.body.oppositeId],
  });

  res.status(201).json({
    status: "success",
  });
});

exports.getFriends = catchAsync(async (req, res, next) => {
  const amountList = await Amount.find({
    between: req.user._id,
  });
  console.log(amountList);
  const friendList = await FriendList.findById(req.user.friendsId)
    .populate({
      path: "friends",
      select: "name id _id DpUrl",
    })
    .lean();

  friendList.friends = await friendList.friends.map((friend) => {
    let amount = 0;
    const amountData = amountList.find((amount) =>
      amount.between.includes(friend._id)
    );
    if (amountData.creatorId == req.user._id) {
      amount = amountData.amount;
    } else {
      amount = -amountData.amount;
    }
    return { ...friend, amount };
  });
  res.status(201).json({
    status: "success",
    friendList,
  });
});

exports.getFriendSearchResult = catchAsync(async (req, res, next) => {
  const friendList = await FriendList.findById(req.headers.friendsid);
  const searchResult = await User.find({
    $and: [
      { _id: { $regex: new RegExp("^" + req.params.keyword) } },
      { _id: { $nin: [req.headers._id, ...friendList.friends] } },
    ],
  }).limit(10);
  res.status(201).json({
    status: "success",
    searchResult,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );
  req.user = decoded;
  next();
});
