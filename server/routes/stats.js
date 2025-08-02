import express from "express";
import { authenticateToken } from "../middleware/auth.js";

import {
  getOrdersOverTime,
  getOrderStatusSummary,
  getOrdersByTailor,
  getRevenueByVisitor,
  getMyOrdersStats,
  getMyVisitsStats,
  getMyTailorOrders,
} from "../controllers/statsController.js";
const router = express.Router();

router.get("/orders-over-time", authenticateToken, getOrdersOverTime);
router.get("/orders-status-summary",authenticateToken, getOrderStatusSummary);
router.get("/orders-by-tailor", authenticateToken, getOrdersByTailor);
router.get("/revenue-by-visitor", authenticateToken, getRevenueByVisitor);

router.get("/my-orders", authenticateToken, getMyOrdersStats);
router.get("/my-visits", authenticateToken, getMyVisitsStats);
router.get("/my-tailor-orders", authenticateToken, getMyTailorOrders);

export default router;
