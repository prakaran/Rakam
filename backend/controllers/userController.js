const bcrypt = require("bcryptjs");
const User = require("../models/users");
const CustomError = require("../errors/customError");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const updateUser = async (req, res) => {
  const updatedUser = {};

  if (req.body.firstName !== undefined) {
    updatedUser.firstName = req.body.firstName;
  }

  if (req.body.lastName !== undefined) {
    updatedUser.lastName = req.body.lastName;
  }

  if (req.body.password !== undefined) {
    updatedUser.password = await hashPassword(req.body.password);
  }

  if (Object.keys(updatedUser).length === 0) {
    throw new CustomError("No fields to update.", 400);
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { $set: updatedUser },
    { returnDocument: "after" },
  );

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Update successful.",
    data: {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        userId: user._id,
      },
    },
  });
};

const getMe = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId }).select("-password");

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "User retrieved successful.",
    data: { user },
  });
};

const getUser = async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
          $options: "i",
        },
      },
      {
        lastName: {
          $regex: filter,
          $options: "i",
        },
      },
    ],
  }).limit(20);
  res.status(200).json({
    success: true,
    message: "User retrieved successful",
    data: {
      users: users.map((user) => ({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    },
  });
};

module.exports = {
  updateUser,
  getMe,
  getUser,
};
