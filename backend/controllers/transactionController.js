const mongoose = require("mongoose");
const Account = require("../models/account");
const Transaction = require("../models/transaction");

const getTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const transactions = await Transaction.find({
      $or: [{ from: userId }, { to: userId }],
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    if (transactions.length === 0) {
      return res
        .status(200)
        .json({ transactions, page, count: transactions.length });
    }

    res.status(200).json({ transactions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const transferFunds = async (req, res) => {
  let session;

  try {
    const { to, amount } = req.body;
    const from = req.user.userId;

    const amountNum = Number(amount);

    if (!to || Number.isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ message: "Invalid Input" });
    }

    if (!Number.isInteger(amountNum)) {
      return res.status(400).json({
        message: "Amount must be in paisa (integer)",
      });
    }

    if (to === from) {
      return res.status(400).json({ message: "Cannot send to yourself" });
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
      return res.status(400).json({ message: "Insufficient balance" });
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

    return res.status(200).json({ message: "Transfer successful" });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

module.exports = {
  getTransactions,
  transferFunds,
};
