const User = require('../models/User');
const { logActivity } = require('../utils/logger');

// @desc    Get all users (paginated, searchable, filterable)
// @route   GET /api/users
// @access  Admin/Manager
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    if (req.query.role) filter.role = req.query.role;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.plan) filter.plan = req.query.plan;

    const sort = req.query.sort || '-createdAt';

    const [users, total] = await Promise.all([
      User.find(filter).sort(sort).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Admin/Manager
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create user (admin)
// @route   POST /api/users
// @access  Admin
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, plan, status } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const user = await User.create({ name, email, password, role, plan, status });

    await logActivity({
      user: req.user._id,
      action: 'create_user',
      entity: 'User',
      entityId: user._id.toString(),
      description: `Admin created user ${user.email}`,
      req,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Admin
exports.updateUser = async (req, res) => {
  try {
    const allowed = ['name', 'email', 'role', 'status', 'plan', 'phone', 'company', 'country'];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    await logActivity({
      user: req.user._id,
      action: 'update_user',
      entity: 'User',
      entityId: user._id.toString(),
      description: `Admin updated user ${user.email}`,
      req,
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin
exports.deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete yourself' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await logActivity({
      user: req.user._id,
      action: 'delete_user',
      entity: 'User',
      entityId: req.params.id,
      description: `Admin deleted user ${user.email}`,
      req,
    });

    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk action (suspend/activate/delete)
// @route   POST /api/users/bulk
// @access  Admin
exports.bulkAction = async (req, res) => {
  try {
    const { ids, action } = req.body;
    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ message: 'No user IDs provided' });
    }

    const validActions = ['suspend', 'activate', 'delete'];
    if (!validActions.includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    // Prevent self-targeting
    const cleanIds = ids.filter((id) => id !== req.user._id.toString());

    let result;
    if (action === 'delete') {
      result = await User.deleteMany({ _id: { $in: cleanIds } });
    } else {
      const status = action === 'suspend' ? 'suspended' : 'active';
      result = await User.updateMany({ _id: { $in: cleanIds } }, { status });
    }

    await logActivity({
      user: req.user._id,
      action: `bulk_${action}`,
      entity: 'User',
      description: `Bulk ${action} on ${cleanIds.length} users`,
      req,
    });

    res.json({ message: `Bulk ${action} complete`, affected: result.modifiedCount || result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
