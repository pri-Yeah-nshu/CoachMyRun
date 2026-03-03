const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      uppercase: true,
      default: "NEW USER",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      lowercase: true,
      enum: ["male", "female", "others"],
    },
    height: {
      type: Number,
      required: false,
      default: 0,
    },
    weight: {
      type: Number,
      required: false,
      default: 0,
    },
    runningFrequency: {
      type: String,
      required: true,
      enum: ["Daily", "Weekly", "Monthly", "Occasionally", "Never"],
      default: "Never",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
