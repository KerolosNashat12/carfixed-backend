const Settings = require('../models/Settings');

// @desc    Get settings (singleton)
// @route   GET /api/settings
// @access  Admin
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Admin
exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});

    const allowed = [
      'siteName',
      'siteDescription',
      'supportEmail',
      'maintenanceMode',
      'allowSignup',
      'emailNotifications',
      'twoFactorRequired',
      'plans',
    ];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) settings[field] = req.body[field];
    });
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get activity log (paginated)
// @route   GET /api/settings/activity
// @access  Admin
exports.getActivityLog = async (req, res) => {
  try {
    const Activity = require('../models/Activity');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      Activity.find()
        .populate('user', 'name email avatar')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      Activity.countDocuments(),
    ]);

    res.json({
      activities,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
