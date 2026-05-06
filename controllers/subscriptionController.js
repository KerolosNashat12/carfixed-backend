const Subscription = require('../models/Subscription');
const User = require('../models/User');
const { logActivity } = require('../utils/logger');

// @desc    Get subscriptions (with filters)
// @route   GET /api/subscriptions
// @access  Admin/Manager
exports.getSubscriptions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.plan) filter.plan = req.query.plan;

    const [subscriptions, total] = await Promise.all([
      Subscription.find(filter)
        .populate('user', 'name email avatar')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      Subscription.countDocuments(filter),
    ]);

    res.json({
      subscriptions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create subscription
// @route   POST /api/subscriptions
// @access  Admin
exports.createSubscription = async (req, res) => {
  try {
    const { user, plan, amount, interval, currency } = req.body;

    const userExists = await User.findById(user);
    if (!userExists) return res.status(404).json({ message: 'User not found' });

    const sub = await Subscription.create({ user, plan, amount, interval, currency });
    await User.findByIdAndUpdate(user, { plan });

    await logActivity({
      user: req.user._id,
      action: 'create_subscription',
      entity: 'Subscription',
      entityId: sub._id.toString(),
      description: `Created ${plan} subscription for ${userExists.email}`,
      req,
    });

    const populated = await sub.populate('user', 'name email avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update subscription
// @route   PUT /api/subscriptions/:id
// @access  Admin
exports.updateSubscription = async (req, res) => {
  try {
    const allowed = ['plan', 'status', 'amount', 'interval', 'currency', 'endDate'];
    const updates = {};
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    if (updates.status === 'cancelled') {
      updates.cancelledAt = new Date();
    }

    const sub = await Subscription.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).populate('user', 'name email avatar');

    if (!sub) return res.status(404).json({ message: 'Subscription not found' });

    if (updates.plan) {
      await User.findByIdAndUpdate(sub.user._id, { plan: updates.plan });
    }

    res.json(sub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel subscription
// @route   POST /api/subscriptions/:id/cancel
// @access  Admin
exports.cancelSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled', cancelledAt: new Date() },
      { new: true }
    ).populate('user', 'name email avatar');

    if (!sub) return res.status(404).json({ message: 'Subscription not found' });

    await logActivity({
      user: req.user._id,
      action: 'cancel_subscription',
      entity: 'Subscription',
      entityId: sub._id.toString(),
      description: `Cancelled subscription for ${sub.user.email}`,
      req,
    });

    res.json(sub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete subscription
// @route   DELETE /api/subscriptions/:id
// @access  Admin
exports.deleteSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findByIdAndDelete(req.params.id);
    if (!sub) return res.status(404).json({ message: 'Subscription not found' });
    res.json({ message: 'Subscription deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
