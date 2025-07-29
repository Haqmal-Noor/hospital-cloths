import express from "express";
import {
  getAllTailors,
  getAllCustomers,
  getAllDashboardStatistics,
} from "../controllers/userController.js";

import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Get all tailors (Admin only)
router.get(
  "/tailors",
  authenticateToken,
  authorizeRoles("admin"),
  getAllTailors
);

// Get all customers (For visitors creating orders)
router.get(
  "/customers",
  authenticateToken,
  authorizeRoles("visitor", "admin"),
  getAllCustomers
);

// Get dashboard statistics
router.get("/dashboard-stats", authenticateToken, getAllDashboardStatistics);

export default router;
