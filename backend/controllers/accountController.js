const Account = require("../models/account");

const getBalance = async (req, res) => {
  const userId = req.user.userId;
  const account = await Account.findOne({ user: userId });

  if (!account) {
    throw new CustomError("Account not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Account balance retrieved.",
    data: { balance: account.balance },
  });
};
module.exports = {
  getBalance,
};
