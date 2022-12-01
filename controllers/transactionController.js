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
  const amountList = await Amount.find({
    between: req.body.between,
  }).snapshot();
  if (amountList.creatorId == creator) {
    if (req.body.type === "gave") {
      amountList.amount = amountList.amount + req.body.amount;
    } else {
      amountList.amount = amountList.amount - req.body.amount;
    }
  } else {
    if (req.body.type === "gave") {
      amountList.amount = amountList.amount - req.body.amount;
    } else {
      amountList.amount = amountList.amount + req.body.amount;
    }
  }

  await Amount.findOneAndUpdate(
    {
      between: req.body.between,
    },
    { amount: amountList.amount }
  );
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
    const amountList = await Amount.find({
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

exports.getTransactions = catchAsync(async (req, res, next) => {
  const creatorId = req.user._id;
  let transaction = await Transaction.find(
    {
      between: creatorId,
      transactionType: "normal",
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
