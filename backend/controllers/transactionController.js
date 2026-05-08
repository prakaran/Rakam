const mongoose = require("mongoose");
const Account = require("../models/account");
const Transaction = require("../models/transaction");
const CustomError = require("../errors/customError");

const getTransactions = async (req, res) => {
  const userId = req.user.userId;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const filter = {
    $or: [{ from: userId }, { to: userId }],
  };

  const transactions = await Transaction.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Transaction.countDocuments(filter);

  return res.status(200).json({
    success: true,
    message: "Transactions retrieved successfully",
    data: { transactions, page, limit, total },
  });
};

const transferFunds = async (req, res) => {
  let session;

  try {
    const { to, amount } = req.body;
    const from = req.user.userId;

    const amountNum = Number(amount);

    if (!to || Number.isNaN(amountNum) || amountNum <= 0) {
      throw new CustomError("Invalid Input", 400);
    }

    if (!Number.isInteger(amountNum)) {
      throw new CustomError("Amount must be in paisa (integer).", 400);
    }

    if (to === from) {
      throw new CustomError("Cannot send to yourself.", 400);
    }

    session = await mongoose.startSession();
    session.startTransaction();

    const debitResult = await Account.updateOne(
      {
        user: from,
        balance: { $gte: amountNum },
      },
      {
        $inc: { balance: -amountNum },
      },
    ).session(session);

    if (debitResult.modifiedCount === 0) {
      await session.abortTransaction();
      session.endSession();
      throw new CustomError("Insufficient balance.", 400);
    }

    await Account.updateOne(
      { user: to },
      { $inc: { balance: amountNum } },
    ).session(session);

    await new Transaction({
      from,
      to,
      amount: amountNum,
      type: "TRANSFER",
      status: "SUCCESS",
    }).save({ session });

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json({ success: true, message: "Transfer successful" });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    console.error(error);
    throw error;
  }
};

module.exports = {
  getTransactions,
  transferFunds,
};
