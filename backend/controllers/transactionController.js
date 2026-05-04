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
  const session = await mongoose.startSession();
  try {
    const { to, amount } = req.body;
    const from = req.user.userId;

    if (!to || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid Input" });
    }
    if (to == from) {
      return res.status(400).json({ message: "Cannot send to yourself" });
    }

    session.startTransaction();

    const fromAccount = await Account.findOne({ user: from }).session(session);
    const toAccount = await Account.findOne({ user: to }).session(session);

    if (!fromAccount || !toAccount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid accounts" });
    }
    if (fromAccount.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    await Account.updateOne(
      { user: from },
      { $inc: { balance: -amount } },
    ).session(session);

    await Account.updateOne(
      { user: to },
      { $inc: { balance: amount } },
    ).session(session);

    await new Transaction({
      from,
      to,
      amount,
      type: "TRANSFER",
      status: "SUCCESS",
    }).save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Transfer successful" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    res.status(500).json("Something went wrong.");
  }
};
module.exports = {
  getTransactions,
  transferFunds,
};
