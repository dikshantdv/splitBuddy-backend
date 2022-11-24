const Amount = require("../models/AmountModel");
const Split = require("../models/SplitModel");
const Transaction = require("../models/TransactionModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.AddAmount = catchAsync(async (req, res, next) => {
  let amount = await Amount.create(req.body);

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

exports.getTransaction = catchAsync(async (req, res, next) => {
  const creatorId = req.params.id;
  let transaction = await Transaction.find({ creator: creatorId }).populate({
    path: "amounts",
    select: "type name amount creatorId -transactionId -_id ",
    // match: queryStr,
  });

  res.status(201).json({
    status: "success",
    transaction,
  });
});
