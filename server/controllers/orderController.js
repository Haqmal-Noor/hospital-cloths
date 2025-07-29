import Order from "../models/Order.js";
import User from "../models/User.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
// Get orders based on user role
export const getOrders = catchAsync(async (req, res, next) => {
  const { status, page = 1, limit = 10, sort = "-createdAt" } = req.query;
  let query = {};

  // Role-based filtering
  switch (req.user.role) {
    case "admin":
      // Admin can see all orders
      break;
    case "customer":
      query.customerId = req.user._id;
      break;
    case "visitor":
      query.visitorId = req.user._id;
      break;
    case "tailor":
      query.tailorId = req.user._id;
      break;
    default:
      return next(new AppError("Unauthorized access", 403));
  }

  // Add status filter if provided
  if (status && status !== "all") {
    query.status = status;
  }

  const orders = await Order.find(query)
    .populate("customerId", "name email phone")
    .populate("visitorId", "name email commissionRate")
    .populate("tailorId", "name email phone")
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Order.countDocuments(query);

  res.json({
    orders,
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / limit),
    totalOrders: total,
  });
});

// Get single order
export const getSingleOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("customerId", "name email phone address")
    .populate("visitorId", "name email commissionRate")
    .populate("tailorId", "name email phone")
    .populate("notes.author", "name");

  if (!order) {
    // return res.status(404).json({ message: "Order not found" });
    return next(new AppError("Order not found", 403));
  }

  // Check authorization
  const isAuthorized =
    req.user.role === "admin" ||
    (req.user.role === "customer" &&
      order.customerId._id.toString() === req.user._id.toString()) ||
    (req.user.role === "visitor" &&
      order.visitorId &&
      order.visitorId._id.toString() === req.user._id.toString()) ||
    (req.user.role === "tailor" &&
      order.tailorId &&
      order.tailorId._id.toString() === req.user._id.toString());

  if (!isAuthorized) {
    // return res.status(403).json({ message: "Access denied to this order" });
    return next("Access denied to this order", 403);
  }

  res.json({ order });
});

// Create new order
export const createOrder = catchAsync(async (req, res, next) => {
  const orderData = {
    ...req.body,
    customerId:
      req.user.role === "customer" ? req.user._id : req.body.customerId,
    visitorId: req.user.role === "visitor" ? req.user._id : undefined,
  };

  // If visitor is creating order, ensure customer exists
  if (req.user.role === "visitor" && req.body.customerId) {
    const customer = await User.findById(req.body.customerId);
    if (!customer || customer.role !== "customer") {
      // return res.status(400).json({ message: "Invalid customer ID" });
      return next("Invalid customer ID", 400);
    }
  }

  const order = new Order(orderData);
  await order.save();

  await order.populate([
    { path: "customerId", select: "name email" },
    { path: "visitorId", select: "name email commissionRate" },
  ]);

  res.status(201).json({
    message: "Order created successfully",
    order,
  });
});

export const assignTailor = catchAsync(async (req, res, next) => {
  const { tailorId } = req.body;

  // Verify tailor exists and has correct role
  const tailor = await User.findById(tailorId);
  if (!tailor || tailor.role !== "tailor") {
    // return res.status(400).json({ message: "Invalid tailor ID" });
    return next(new AppError("Invalid tailor ID", 400));
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      tailorId,
      status: "assigned",
      $push: {
        notes: {
          author: req.user._id,
          content: `Order assigned to ${tailor.name}`,
        },
      },
    },
    { new: true }
  ).populate("tailorId", "name email");

  if (!order) {
    // return res.status(404).json({ message: "Order not found" });
    return next(new AppError("Order not found", 404));
  }

  res.json({
    message: "Tailor assigned successfully",
    order,
  });
});

// update order status
export const updatedOrderStatus = catchAsync(async (req, res, next) => {
  const { status, note } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    // return res.status(404).json({ message: "Order not found" });
    return next(new AppError("Order not found", 404));
  }

  // Check authorization
  const canUpdateStatus =
    req.user.role === "admin" ||
    (req.user.role === "tailor" &&
      order.tailorId &&
      order.tailorId.toString() === req.user._id.toString());

  if (!canUpdateStatus) {
    // return res
    //   .status(403)
    //   .json({ message: "Not authorized to update this order status" });
    return next(
      new AppError("Not authorized to update this order status", 403)
    );
  }

  const updateData = { status };

  // Set actual delivery date if completed
  if (status === "completed") {
    updateData.actualDelivery = new Date();
  }

  // Add note if provided
  if (note) {
    updateData.$push = {
      notes: {
        author: req.user._id,
        content: note,
      },
    };
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  ).populate([
    { path: "customerId", select: "name email" },
    { path: "tailorId", select: "name email" },
  ]);

  res.json({
    message: "Order status updated successfully",
    order: updatedOrder,
  });
});
