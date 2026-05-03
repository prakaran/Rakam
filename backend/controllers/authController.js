const bcrypt = require("bcryptjs");
const { User } = require("../models/users");
const { Account } = require("../models/account");
const jwt = require("jsonwebtoken");
const signup = async (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already registered. Please login.");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {
      email,
      firstName,
      lastName,
      password: hashedPassword,
    };

    const user = await User.create(newUser);
    const account = await Account.create({
      user: user._id,
      balance: process.env.INITIAL_BALANCE,
      currency: "NPR",
    });
    const token = jwt.sign(
      { userId: user._id, name: user.firstName },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME },
    );
    res.status(201).json({ message: "User created successfully.", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};
const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("Invalid Credentials");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid Credentials");
  }
  const isValid = bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("Invalid Credentials");
  }
  const token = jwt.sign(
    { userId: user._id, name: user.firstName },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    },
  );
  res.status(200).json({
    user: {
      name: user.name,
    },
    token,
  });
};

module.exports = {
  signin,
  signup,
};
