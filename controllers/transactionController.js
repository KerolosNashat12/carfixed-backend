const Transaction = require('../models/Transaction');

// @desc    Get transactions (paginated)
// @route   GET /api/transactions
// @access  Admin/Manager
exports.getTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.userId) filter.user = req.query.userId;

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .populate('user', 'name email avatar')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments(filter),
    ]);

    res.json({
      transactions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Admin/Manager
exports.getTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id).populate('user', 'name email');
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    res.json(tx);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create manual transaction
// @route   POST /api/transactions
// @access  Admin
exports.createTransaction = async (req, res) => {
  try {
    const tx = await Transaction.create(req.body);
    const populated = await tx.populate('user', 'name email avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Refund transaction
// @route   POST /api/transactions/:id/refund
// @access  Admin
exports.refundTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status: 'refunded' },
      { new: true }
    ).populate('user', 'name email');
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    res.json(tx);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
