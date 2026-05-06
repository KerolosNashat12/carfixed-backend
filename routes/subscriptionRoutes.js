const express = require('express');
const router = express.Router();
const {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  cancelSubscription,
  deleteSubscription,
} = require('../controllers/subscriptionController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', authorize('admin', 'manager'), getSubscriptions);
router.post('/', authorize('admin'), createSubscription);
router.put('/:id', authorize('admin'), updateSubscription);
router.post('/:id/cancel', authorize('admin'), cancelSubscription);
router.delete('/:id', authorize('admin'), deleteSubscription);

module.exports = router;
