import Order from "../models/order.js";

export const getOrdersOverTime = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const getOrderStatusSummary = async (req, res, next) => {
  try {
    const summary = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert array to object:
    const result = {};
    summary.forEach((item) => {
      // Optional: normalize status key to use snake_case if needed
      const key = item._id.replace("-", "_");
      result[key] = item.count;
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};


export const getOrdersByTailor = async (req, res, next) => {
  try {
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
          from: "users", // collection name in MongoDB
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
  } catch (error) {
    next(error);
  }
};


export const getRevenueByVisitor = async (req, res, next) => {
  try {
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
          from: "users", // MongoDB collection name
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
  } catch (error) {
    next(error);
  }
};


export const getMyOrdersStats = async (req, res, next) => {
  try {
    const customerId = req.user._id;

    // Get all status counts for this customer
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

    // Format result
    const stats = { total: 0 };
    grouped.forEach((item) => {
      const key = item._id.replace("-", "_");
      stats[key] = item.count;
      stats.total += item.count;
    });

    res.json(stats);
  } catch (error) {
    next(error);
  }
};


export const getMyVisitsStats = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};


export const getMyTailorOrders = async (req, res, next) => {
  try {
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

    // Format the counts into an object
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
  } catch (error) {
    next(error);
  }
};
