import express from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";
// mine chainges
import {
  getOrders,
  getSingleOrder,
  createOrder,
  assignTailor,
  updatedOrderStatus,
} from "../controllers/orderController.js";
const router = express.Router();

// Get orders based on user role
router.get("/", authenticateToken, getOrders);

// Get single order
router.get("/:id", authenticateToken, getSingleOrder);
// Create new order
router.post(
  "/",
  authenticateToken,
  authorizeRoles("visitor", "customer"),
  createOrder
);

//  Assign tailor to order (Admin only)
router.put(
  "/:id/assign-tailor",
  authenticateToken,
  authorizeRoles("admin"),
  assignTailor
);

// Update order status
router.put("/:id/status", authenticateToken, updatedOrderStatus);

export default router;
