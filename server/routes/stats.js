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


router.get("/orders-over-time", getOrdersOverTime);
router.get("/order-status-summary", getOrderStatusSummary);
router.get("/orders-by-tailor", getOrdersByTailor);
router.get("/revenue-by-visitor", getRevenueByVisitor);

router.get("/my-orders", authenticateToken, getMyOrdersStats);
router.get("/my-visits", authenticateToken, getMyVisitsStats);
router.get("/my-tailor-orders", authenticateToken, getMyTailorOrders);


export default router;
