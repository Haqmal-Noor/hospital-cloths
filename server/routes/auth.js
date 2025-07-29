import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  registerUser,
  loginUser,
  getCurrentUserPro,
  updateUserPro,
} from "../controllers/authController.js";

const router = express.Router();

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Get current user profile
router.get("/profile", authenticateToken, getCurrentUserPro);

// Update user profile
router.put("/profile", authenticateToken, updateUserPro);

export default router;
