const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getTransaction,
  createTransaction,
  refundTransaction,
} = require('../controllers/transactionController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', authorize('admin', 'manager'), getTransactions);
router.post('/', authorize('admin'), createTransaction);
router.get('/:id', authorize('admin', 'manager'), getTransaction);
router.post('/:id/refund', authorize('admin'), refundTransaction);

module.exports = router;
