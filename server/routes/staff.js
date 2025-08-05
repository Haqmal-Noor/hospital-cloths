import express from "express";
const router = express.Router();
import {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
} from "../controllers/staffController.js";
import { authenticateToken } from "../middleware/auth.js";

router.post("/", authenticateToken, createStaff); // Create
router.get("/", authenticateToken, getAllStaff); // List all or filtered
router.get("/:id", getStaffById); // Read one
router.put("/:id", updateStaff); // Update
router.delete("/:id", deleteStaff); // Delete

export default router;
