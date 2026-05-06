const User = require('../models/User');
const generateToken = require('../utils/token');
const { logActivity } = require('../utils/logger');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'User with that email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role && ['admin', 'manager', 'user'].includes(role) ? role : 'user',
    });

    await logActivity({
      user: user._id,
      action: 'register',
      entity: 'User',
      entityId: user._id.toString(),
      description: `${user.email} registered`,
      req,
    });

    res.status(201).json({
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'Account suspended' });
    }

    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save();

    await logActivity({
      user: user._id,
      action: 'login',
      entity: 'User',
      entityId: user._id.toString(),
      description: `${user.email} logged in`,
      req,
    });

    res.json({
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  res.json(req.user);
};

// @desc    Update profile
// @route   PUT /api/auth/me
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const allowed = ['name', 'phone', 'company', 'country', 'avatar'];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Provide current and new password' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be 6+ characters' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
