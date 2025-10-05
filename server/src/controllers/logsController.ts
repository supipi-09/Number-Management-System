import { Request, Response } from "express";
import NumberLog from "../models/NumberLog";

export const getLogs = async (req: Request, res: Response) => {
  try {
    const {
      number,
      action,
      performedBy,
      startDate,
      endDate,
      page = 1,
      limit = 25,
      sortBy = "timestamp",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter: any = {};

    if (number) filter.number = { $regex: number, $options: "i" };
    if (action) filter.action = action;
    if (performedBy) filter.performedBy = performedBy;

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate as string);
      if (endDate) filter.timestamp.$lte = new Date(endDate as string);
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === "desc" ? -1 : 1;

    // Get logs with pagination and populate user info
    const logs = await NumberLog.find(filter)
      .populate("performedBy", "username email")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await NumberLog.countDocuments(filter);

    res.json({
      success: true,
      data: logs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
      message: "Logs retrieved successfully",
    });
  } catch (error) {
    console.error("Get logs error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getNumberLogs = async (req: Request, res: Response) => {
  try {
    const { number } = req.params;
    const {
      page = 1,
      limit = 25,
      sortBy = "timestamp",
      sortOrder = "desc",
    } = req.query;

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === "desc" ? -1 : 1;

    // Get logs for specific number
    const logs = await NumberLog.find({ number })
      .populate("performedBy", "username email")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await NumberLog.countDocuments({ number });

    res.json({
      success: true,
      data: logs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
      message: "Number logs retrieved successfully",
    });
  } catch (error) {
    console.error("Get number logs error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getLogStats = async (req: Request, res: Response) => {
  try {
    const stats = await NumberLog.aggregate([
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalLogs = await NumberLog.countDocuments();

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = await NumberLog.countDocuments({
      timestamp: { $gte: sevenDaysAgo },
    });

    const result = {
      totalLogs,
      recentActivity,
      actionBreakdown: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {} as Record<string, number>),
    };

    res.json({
      success: true,
      data: result,
      message: "Log statistics retrieved successfully",
    });
  } catch (error) {
    console.error("Get log stats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
