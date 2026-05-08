const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("../models/users");
const Account = require("../models/account");
const Transaction = require("../models/transaction");
const CustomError = require("../errors/customError");

const signup = async (req, res) => {
  let session;

  try {
    const { email, firstName, lastName, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new CustomError("User already registered. Please login.", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    session = await mongoose.startSession();
    session.startTransaction();

    const userArr = await User.create(
      [
        {
          email,
          firstName,
          lastName,
          password: hashedPassword,
        },
      ],
      { session },
    );

    const user = userArr[0];

    await Account.create(
      [
        {
          user: user._id,
          balance: Number(process.env.INITIAL_BALANCE),
          currency: "NPR",
        },
      ],
      { session },
    );

    await new Transaction({
      to: user._id,
      amount: Number(process.env.INITIAL_BALANCE),
      type: "CREDIT",
      description: "Signup bonus",
    }).save({ session });

    await session.commitTransaction();
    session.endSession();

    const token = jwt.sign(
      { userId: user._id, name: user.firstName },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME },
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { token },
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError("Invalid Credentials", 401);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError("Invalid Credentials", 401);
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new CustomError("Invalid Credentials", 401);
  }

  const token = jwt.sign(
    { userId: user._id, name: user.firstName },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    },
  );

  res.status(200).json({
    success: true,
    message: "Login Successful.",
    data: {
      token,
    },
  });
};

module.exports = {
  signin,
  signup,
};
