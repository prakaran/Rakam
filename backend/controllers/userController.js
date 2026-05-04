const bcrypt = require("bcryptjs");
const User = require("../models/users");

const updateUser = async (req, res) => {
  const updatedUser = {};
  if (req.body.firstName !== undefined) {
    updatedUser.firstName = req.body.firstName;
  }
  if (req.body.lastName !== undefined) {
    updatedUser.lastName = req.body.lastName;
  }
  const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  };
  if (req.body.password !== undefined) {
    updatedUser.password = await hashPassword(req.body.password);
  }
  if (Object.keys(updatedUser).length === 0) {
    throw new Error("No fields to update.");
  }
  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { $set: updatedUser },
    { new: true },
  );
  res.status(200).json({
    message: "update sucessfull",
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      userId: user._id,
    },
  });
};

const getMe = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId }).select("-password");
  res.status(200).json({ user });
};

const getUser = async (req, res) => {
  const filter = req.query.filter || "";
  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });
  res.json({
    user: users.map((user) => ({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
};

module.exports = {
  updateUser,
  getMe,
  getUser,
};
