import { Request, Response } from 'express';
import Number from '../models/Number';
import NumberLog from '../models/NumberLog';
import User from '../models/User';

export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    // Get number statistics
    const numberStats = await Number.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalNumbers = await Number.countDocuments();
    
    const summary = {
      totalNumbers,
      allocatedNumbers: numberStats.find(s => s._id === 'Allocated')?.count || 0,
      availableNumbers: numberStats.find(s => s._id === 'Available')?.count || 0,
      reservedNumbers: numberStats.find(s => s._id === 'Reserved')?.count || 0,
      heldNumbers: numberStats.find(s => s._id === 'Held')?.count || 0,
      quarantinedNumbers: numberStats.find(s => s._id === 'Quarantined')?.count || 0
    };

    res.json({
      success: true,
      data: summary,
      message: 'Dashboard summary retrieved successfully'
    });
  } catch (error) {
    console.error('Get dashboard summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getDashboardAnalytics = async (req: Request, res: Response) => {
  try {
    // Get monthly allocation trends (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyTrends = await NumberLog.aggregate([
      {
        $match: {
          timestamp: { $gte: twelveMonthsAgo },
          action: { $in: ['Allocated', 'Released', 'Reserved'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            action: '$action'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Get service type distribution
    const serviceTypeStats = await Number.aggregate([
      {
        $group: {
          _id: {
            serviceType: '$serviceType',
            status: '$status'
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get special type distribution
    const specialTypeStats = await Number.aggregate([
      {
        $group: {
          _id: '$specialType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = await NumberLog.find({
      timestamp: { $gte: sevenDaysAgo }
    })
    .populate('performedBy', 'username')
    .sort({ timestamp: -1 })
    .limit(10);

    // Get user activity stats
    const userActivityStats = await NumberLog.aggregate([
      {
        $match: {
          timestamp: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: '$performedBy',
          activityCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          username: '$user.username',
          activityCount: 1
        }
      },
      {
        $sort: { activityCount: -1 }
      },
      {
        $limit: 5
      }
    ]);

    const analytics = {
      monthlyTrends,
      serviceTypeStats,
      specialTypeStats,
      recentActivity,
      userActivityStats
    };

    res.json({
      success: true,
      data: analytics,
      message: 'Dashboard analytics retrieved successfully'
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getSystemHealth = async (req: Request, res: Response) => {
  try {
    const totalNumbers = await Number.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalLogs = await NumberLog.countDocuments();
    
    // Get database performance metrics
    const dbStats = {
      totalNumbers,
      totalUsers,
      totalLogs,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version
    };

    res.json({
      success: true,
      data: dbStats,
      message: 'System health retrieved successfully'
    });
  } catch (error) {
    console.error('Get system health error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};