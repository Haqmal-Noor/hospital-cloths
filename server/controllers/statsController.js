import Order from "../models/order.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";


export const getOrdersOverTime = catchAsync(async (req, res, next) => {
  const range = req.query.range || "month";

  let dateFormat;
  if (range === "day") {
    dateFormat = "%Y-%m-%d";
  } else if (range === "week") {
    dateFormat = "%G-%V";
  } else {
    dateFormat = "%Y-%m";
  }

  const stats = await Order.aggregate([
    {
      $group: {
        _id: {
          $dateToString: {
            format: dateFormat,
            date: "$createdAt",
          },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        label: "$_id",
        count: 1,
      },
    },
    { $sort: { label: 1 } },
  ]);

  res.json(stats);
});

export const getOrderStatusSummary = catchAsync(async (req, res, next) => {
  const summary = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const result = {};
  summary.forEach((item) => {
    const key = item._id.replace("-", "_");
    result[key] = item.count;
  });

  res.json(result);
});

export const getOrdersByTailor = catchAsync(async (req, res, next) => {
  const result = await Order.aggregate([
    {
      $match: {
        status: "completed",
        tailorId: { $ne: null },
      },
    },
    {
      $group: {
        _id: "$tailorId",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "tailor",
      },
    },
    {
      $unwind: "$tailor",
    },
    {
      $project: {
        _id: 0,
        tailor: "$tailor.name",
        count: 1,
      },
    },
    { $sort: { count: -1 } },
  ]);

  res.json(result);
});

export const getRevenueByVisitor = catchAsync(async (req, res, next) => {
  const result = await Order.aggregate([
    {
      $match: {
        status: "completed",
        visitorId: { $ne: null },
      },
    },
    {
      $group: {
        _id: "$visitorId",
        revenue: { $sum: "$price" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "visitor",
      },
    },
    {
      $unwind: "$visitor",
    },
    {
      $project: {
        _id: 0,
        visitor: "$visitor.name",
        revenue: 1,
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  res.json(result);
});

export const getMyOrdersStats = catchAsync(async (req, res, next) => {
  const customerId = req.user._id;

  const grouped = await Order.aggregate([
    {
      $match: { customerId },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const stats = { total: 0 };
  grouped.forEach((item) => {
    const key = item._id.replace("-", "_");
    stats[key] = item.count;
    stats.total += item.count;
  });

  res.json(stats);
});

export const getMyVisitsStats = catchAsync(async (req, res, next) => {
  const visitorId = req.user._id;

  const allOrders = await Order.find({ visitorId });

  const totalContracts = allOrders.length;
  const totalRevenue = allOrders.reduce((sum, order) => sum + order.price, 0);
  const completedOrders = allOrders.filter(
    (order) => order.status === "completed"
  ).length;

  res.json({
    totalContracts,
    totalRevenue,
    completedOrders,
  });
});

export const getMyTailorOrders = catchAsync(async (req, res, next) => {
  const tailorId = req.user._id;

  const stats = await Order.aggregate([
    {
      $match: {
        tailorId: tailorId,
      },
    },
    {
      $facet: {
        counts: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ],
        averageCompletion: [
          {
            $match: { status: "completed", actualDelivery: { $ne: null } },
          },
          {
            $project: {
              durationInDays: {
                $divide: [
                  { $subtract: ["$actualDelivery", "$createdAt"] },
                  1000 * 60 * 60 * 24,
                ],
              },
            },
          },
          {
            $group: {
              _id: null,
              average: { $avg: "$durationInDays" },
            },
          },
        ],
      },
    },
  ]);

  const counts = stats[0].counts;
  const avgData = stats[0].averageCompletion[0];

  const result = {
    totalAssigned: 0,
    completed: 0,
    pending: 0,
    in_progress: 0,
    averageCompletionTime: avgData
      ? `${avgData.average.toFixed(1)} days`
      : "N/A",
  };

  for (const c of counts) {
    const key = c._id.replace("-", "_");
    result[key] = c.count;
    result.totalAssigned += c.count;
  }

  res.json(result);
});
