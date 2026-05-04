const Account = require("../models/account");

const getBalance = async (req, res) => {
  const userId = req.user.userId;
  const account = await Account.findOne({ user: userId });
  res.status(200).json({ balance: account.balance });
};
module.exports = {
  getBalance,
};
