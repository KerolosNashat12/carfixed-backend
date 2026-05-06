const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Transaction = require('../models/Transaction');
const Activity = require('../models/Activity');

// @desc    Dashboard overview stats
// @route   GET /api/analytics/overview
// @access  Admin/Manager
exports.getOverview = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [
      totalUsers,
      newUsersThisMonth,
      newUsersLastMonth,
      activeSubscriptions,
      totalRevenue,
      revenueThisMonth,
      revenueLastMonth,
      pendingTransactions,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: startOfMonth } }),
      User.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      Subscription.countDocuments({ status: 'active' }),
      Transaction.aggregate([
        { $match: { status: 'succeeded' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.aggregate([
        { $match: { status: 'succeeded', createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.aggregate([
        {
          $match: {
            status: 'succeeded',
            createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.countDocuments({ status: 'pending' }),
    ]);

    const userGrowth = newUsersLastMonth
      ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100
      : 100;

    const thisMonthRev = revenueThisMonth[0]?.total || 0;
    const lastMonthRev = revenueLastMonth[0]?.total || 0;
    const revenueGrowth = lastMonthRev
      ? ((thisMonthRev - lastMonthRev) / lastMonthRev) * 100
      : (thisMonthRev > 0 ? 100 : 0);

    // MRR estimate from active monthly subs + (yearly subs / 12)
    const mrrAgg = await Subscription.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: null,
          monthly: {
            $sum: { $cond: [{ $eq: ['$interval', 'monthly'] }, '$amount', 0] },
          },
          yearly: {
            $sum: { $cond: [{ $eq: ['$interval', 'yearly'] }, '$amount', 0] },
          },
        },
      },
    ]);

    const mrr = mrrAgg[0] ? mrrAgg[0].monthly + mrrAgg[0].yearly / 12 : 0;

    res.json({
      totalUsers,
      newUsersThisMonth,
      userGrowth: Math.round(userGrowth * 10) / 10,
      activeSubscriptions,
      totalRevenue: totalRevenue[0]?.total || 0,
      revenueThisMonth: thisMonthRev,
      revenueGrowth: Math.round(revenueGrowth * 10) / 10,
      pendingTransactions,
      mrr: Math.round(mrr * 100) / 100,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Revenue trend (last 12 months)
// @route   GET /api/analytics/revenue
// @access  Admin/Manager
exports.getRevenueTrend = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 12;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const data = await Transaction.aggregate([
      { $match: { status: 'succeeded', createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.y': 1, '_id.m': 1 } },
    ]);

    // Fill missing months with zero
    const result = [];
    const cursor = new Date(startDate);
    for (let i = 0; i < months; i++) {
      const y = cursor.getFullYear();
      const m = cursor.getMonth() + 1;
      const found = data.find((d) => d._id.y === y && d._id.m === m);
      result.push({
        label: cursor.toLocaleString('en-US', { month: 'short' }) + ' ' + String(y).slice(2),
        revenue: found ? Math.round(found.revenue * 100) / 100 : 0,
        count: found ? found.count : 0,
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    User growth over time
// @route   GET /api/analytics/user-growth
// @access  Admin/Manager
exports.getUserGrowth = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 12;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1);

    const data = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.y': 1, '_id.m': 1 } },
    ]);

    const result = [];
    const cursor = new Date(startDate);
    for (let i = 0; i < months; i++) {
      const y = cursor.getFullYear();
      const m = cursor.getMonth() + 1;
      const found = data.find((d) => d._id.y === y && d._id.m === m);
      result.push({
        label: cursor.toLocaleString('en-US', { month: 'short' }) + ' ' + String(y).slice(2),
        users: found ? found.count : 0,
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Plan distribution
// @route   GET /api/analytics/plan-distribution
// @access  Admin/Manager
exports.getPlanDistribution = async (req, res) => {
  try {
    const data = await User.aggregate([
      { $group: { _id: '$plan', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(data.map((d) => ({ plan: d._id, count: d.count })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Recent activity feed
// @route   GET /api/analytics/activity
// @access  Admin/Manager
exports.getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const activities = await Activity.find()
      .populate('user', 'name email avatar')
      .sort('-createdAt')
      .limit(limit);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
