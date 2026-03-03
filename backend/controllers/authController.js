const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.register = async (req, res) => {
  try {
    console.log(req.body);
    const {
      name,
      email,
      password,
      age,
      gender,
      height,
      weight,
      runningFrequency,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log(hashedPassword);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      age: Number(age),
      gender,
      height: Number(height),
      weight: Number(weight),
      runningFrequency,
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true only in production with HTTPS
      sameSite: "lax", // important
    });
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid credentials",
      });
    }
    const actualPassword = user.password;
    const isMatched = await bcrypt.compare(password, actualPassword);
    if (!isMatched) {
      res.status(400).json({
        status: "fail",
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true only in production with HTTPS
      sameSite: "lax", // important
    });
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.currentUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decode.id;
    const user = await User.findById(userId);
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {}
};

exports.controlLogout = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not Found",
      });
    }
    res.cookie("token", "", {
      httpOnly: true,
      secure: false, // true only in production with HTTPS
      sameSite: "lax", // important
    });
    res.status(200).json({
      status: "success",
      message: "Logout successfully...",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
