const Amount = require("../models/AmountModel");
const Split = require("../models/SplitModel");
const Transaction = require("../models/TransactionModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.addTransaction = catchAsync(async (req, res, next) => {
  const creator = req.user._id;
  let amount = await Transaction.create({
    creatorId: creator,
    amount: req.body.amount,
    between: req.body.between,
    type: req.body.type,
  });
  const amountList = await Amount.findOne({
    $all: [{ between: req.body.between[0] }, { between: req.body.between[1] }],
  }).snapshot();
  if (amountList.creatorId == creator) {
    if (req.body.type === "gave") {
      amountList.amount = amountList.amount + Number(req.body.amount);
      amountList.save();
    } else {
      amountList.amount = amountList.amount - Number(req.body.amount);
      amountList.save();
    }
  } else {
    if (req.body.type === "gave") {
      amountList.amount = amountList.amount - Number(req.body.amount);
      amountList.save();
    } else {
      amountList.amount = amountList.amount + Number(req.body.amount);
      amountList.save();
    }
  }

  res.status(201).json({
    status: "success",
    amount,
  });
});

exports.AddSplit = catchAsync(async (req, res, next) => {
  const creator = req.user._id;
  let split = await Split.create({ ...req.body, creator });
  for (let i = 0; i < req.body.between.length; i++) {
    if (req.body.between[i] === creator) {
      continue;
    }
    await Transaction.create({
      creatorId: creator,
      amount: req.body.amount / req.body.between.length,
      between: [creator, req.body.between[i]],
      type: "gave",
      name: req.body.name,
      transactionType: "split",
    });
    const amountList = await Amount.findOne({
      between: [creator, req.body.between[i]],
    }).snapshot();
    if (amountList.creatorId == creator) {
      amountList.amount =
        amountList.amount + req.body.amount / req.body.between.length;
      amountList.save();
    } else {
      amountList.amount =
        amountList.amount - req.body.amount / req.body.between.length;
      amountList.save();
    }
  }
  res.status(201).json({
    status: "success",
    split,
  });
});

exports.getFriendTransactions = catchAsync(async (req, res, next) => {
  const creatorId = req.user._id;
  const friend = req.params.id;
  let transaction = await Transaction.find(
    {
      $and: [{ between: creatorId }, { between: friend }],
    },
    { updatedAt: 0 }
  )
    .populate({
      path: "between",
      match: {
        _id: { $ne: creatorId },
      },
      select: "name DpUrl",
    })
    .sort({ createdAt: -1 });

  res.status(201).json({
    status: "success",
    transaction,
  });
});

exports.getTransactions = catchAsync(async (req, res, next) => {
  const creatorId = req.user._id;
  let transaction = await Transaction.find(
    {
      between: creatorId,
    },
    { createdAt: 0, updatedAt: 0 }
  )
    .populate({
      path: "between",
      match: {
        _id: { $ne: creatorId },
      },
      select: "name DpUrl",
    })
    .sort({ createdAt: -1 });

  res.status(201).json({
    status: "success",
    transaction,
  });
});
exports.getSplits = catchAsync(async (req, res, next) => {
  const creatorId = req.user._id;
  let split = await Split.find({ between: creatorId }, { updatedAt: 0 })
    .populate({
      path: "between creator",
      select: "name DpUrl",
    })
    .sort({ createdAt: -1 });

  res.status(201).json({
    status: "success",
    split,
  });
});
