const Split = require("../models/SplitModel");
const Transaction = require("../models/TransactionModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.addTransaction = catchAsync(async (req, res, next) => {
  let amount = await Transaction.create({
    creatorId: req.body._id,
    amount: req.body.amount,
    between: [req.body._id, req.body._withId],
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
    //addAmount wala lag jaega jab frontend se transacId bhi aa jaegi
  }
  res.status(201).json({
    status: "success",
    split,
  });
});

exports.getTransactions = catchAsync(async (req, res, next) => {
  const creatorId = req.params.id;
  let transaction = await Transaction.find({ between: creatorId });

  res.status(201).json({
    status: "success",
    transaction,
  });
});
