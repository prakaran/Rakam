const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "must provide name"],
      trim: true,
      maxlength: [50, "name cannot be more that 50 character"],
    },
    lastName: {
      type: String,
      required: [true, "must provide name"],
      trim: true,
      maxlength: [50, "name cannot be more that 50 character"],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      lowercase: true,
      minLength: 3,
      maxlength: 30,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", UserSchema);
