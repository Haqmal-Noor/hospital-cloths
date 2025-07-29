import User from "../models/User.js";
import Order from "../models/Order.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

// Get all tailors (Admin only)
export const getAllTailors = catchAsync(async (req, res, next) => {
  const tailors = await User.find({
    role: "tailor",
    isActive: true,
  }).select("name email phone");

  if (!tailors || tailors.length === 0) {
    return next(new AppError("No active tailors found", 404));
  }
  res.status(200).json({ tailors });
});

// Get all customers (For visitors creating orders)
export const getAllCustomers = catchAsync(async (req, res, next) => {
  const customers = await User.find({
    role: "customer",
    isActive: true,
  }).select("name email phone");

  if (!customers || customers.length === 0) {
    return next(new AppError("No active customers found", 404));
  }

  res.json({ customers });
});

// Get dashboard statistics
export const getAllDashboardStatistics = catchAsync(async (req, res, next) => {
  let stats = {};

  switch (req.user.role) {
    case "admin":
      const totalOrders = await Order.countDocuments();
      const pendingOrders = await Order.countDocuments({ status: "pending" });
      const completedOrders = await Order.countDocuments({
        status: "completed",
      });
      const totalTailors = await User.countDocuments({
        role: "tailor",
        isActive: true,
      });

      stats = {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalTailors,
      };
      break;

    case "customer":
      const customerOrders = await Order.countDocuments({
        customerId: req.user._id,
      });
      const customerPending = await Order.countDocuments({
        customerId: req.user._id,
        status: { $in: ["pending", "assigned", "in-progress"] },
      });
      const customerCompleted = await Order.countDocuments({
        customerId: req.user._id,
        status: "completed",
      });

      stats = {
        totalOrders: customerOrders,
        pendingOrders: customerPending,
        completedOrders: customerCompleted,
      };
      break;

    case "tailor":
      const tailorOrders = await Order.countDocuments({
        tailorId: req.user._id,
      });
      const tailorPending = await Order.countDocuments({
        tailorId: req.user._id,
        status: { $in: ["assigned", "in-progress"] },
      });
      const tailorCompleted = await Order.countDocuments({
        tailorId: req.user._id,
        status: "completed",
      });

      stats = {
        totalOrders: tailorOrders,
        pendingOrders: tailorPending,
        completedOrders: tailorCompleted,
      };
      break;

    case "visitor":
      const visitorOrders = await Order.countDocuments({
        visitorId: req.user._id,
      });
      const visitorCompleted = await Order.countDocuments({
        visitorId: req.user._id,
        status: "completed",
      });

      // Calculate total commission
      const completedOrdersData = await Order.find({
        visitorId: req.user._id,
        status: "completed",
      });

      const totalCommission = completedOrdersData.reduce((total, order) => {
        return total + order.price * (req.user.commissionRate / 100);
      }, 0);

      stats = {
        totalOrders: visitorOrders,
        completedOrders: visitorCompleted,
        totalCommission,
      };
      break;
    default:
      return next(
        new AppError("Role not authorized to view dashboard stats", 403)
      );
  }

  res.status(200).json({ stats });
});
