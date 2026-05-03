const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  balance: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  currency: {
    type: String,
    default: "NPR",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});
const Account = mongoose.model("Account", AccountSchema);

module.exports = {
  Account,
};
