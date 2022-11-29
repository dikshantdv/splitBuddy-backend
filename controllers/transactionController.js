const Split = require("../models/SplitModel");
const Transaction = require("../models/TransactionModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.addTransaction = catchAsync(async (req, res, next) => {
  let amount = await Transaction.create({
    creatorId: req.body._id,
    amount: req.body.amount,
    between: req.body.between,
    type: req.body.type,
  });

  res.status(201).json({
    status: "success",
    amount,
  });
});

exports.AddSplit = catchAsync(async (req, res, next) => {
  let split = await Split.create(req.body);
  for (let i = 0; i < req.body.between.length; i++) {
    if (req.body.between[i] === req.body.creator) {
      continue;
    }
    await Transaction.create({
      creatorId: req.body.creator,
      amount: req.body.amount / req.body.between.length,
      between: [req.body.creator, req.body.between[i]],
      type: "gave",
      name: req.body.name,
      transactionType: "split",
    });
  }
  res.status(201).json({
    status: "success",
    split,
  });
});

exports.getTransactions = catchAsync(async (req, res, next) => {
  const creatorId = req.params.id;
  let transaction = await Transaction.find(
    {
      between: creatorId,
      transactionType: "normal",
    },
    { createdAt: 0, updatedAt: 0 }
  ).populate({
    path: "between",
    match: {
      _id: { $ne: creatorId },
    },
    select: "name DpUrl",
  });

  res.status(201).json({
    status: "success",
    transaction,
  });
});
exports.getSplits = catchAsync(async (req, res, next) => {
  const creatorId = req.params.id;
  let split = await Split.find(
    { between: creatorId },
    { createdAt: 0, updatedAt: 0 }
  ).populate({
    path: "between creator",
    select: "name DpUrl",
  });

  res.status(201).json({
    status: "success",
    split,
  });
});
