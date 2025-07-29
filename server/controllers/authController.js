import User from "../models/User.js";
import {
  generateToken,
  generateRefreshToken,
  authenticateToken,
} from "../middleware/auth.js";

import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

// Register user
export const registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role, commissionRate, phone, address } =
    req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // return res
    //   .status(400)
    //   .json({ message: "User with this email already exists" });
    return next(new AppError("User with this email already exists", 400));
  }

  // Validate role-specific fields
  if (
    role === "visitor" &&
    (!commissionRate || commissionRate < 0 || commissionRate > 100)
  ) {
    // return res.status(400).json({
    //   message: "Valid commission rate (0-100) required for visitors",
    // });
    return next(
      new AppError("Valid commission rate (0-100) required for visitors", 400)
    );
  }

  // Create new user
  const userData = {
    name,
    email,
    password,
    role,
    phone,
    address,
  };

  if (role === "visitor") {
    userData.commissionRate = commissionRate;
  }

  const user = new User(userData);
  await user.save();

  // Generate tokens
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.status(201).json({
    message: "User registered successfully",
    user,
    token,
    refreshToken,
  });
});

export const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    // return res.status(401).json({ message: "Invalid email or password" });
    return next(new AppError("Invalid email or password", 401));
  }

  // Check if account is active
  if (!user.isActive) {
    // return res.status(401).json({ message: "Account is deactivated" });
    return next(new AppError("Account is deactivated", 401));
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    // return res.status(401).json({ message: "Invalid email or password" });
    return next(new AppError("Invalid email or password", 401));
  }

  // Generate tokens
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.json({
    message: "Login successful",
    user,
    token,
    refreshToken,
  });
});

// Get current user profile
export const getCurrentUserPro = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError("User not found in request", 401));
  }
  res.json({ user: req.user });
});

// Update user profile
export const updateUserPro = catchAsync(async (req, res, next) => {
  const { name, phone, address } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, address },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return next(new AppError("Profile update failed: user not found", 404));
  }
  res.json({
    message: "Profile updated successfully",
    user: updatedUser,
  });
});
