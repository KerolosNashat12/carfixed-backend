const express = require('express');
const router = express.Router();
const {
  getOverview,
  getRevenueTrend,
  getUserGrowth,
  getPlanDistribution,
  getRecentActivity,
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin', 'manager'));

router.get('/overview', getOverview);
router.get('/revenue', getRevenueTrend);
router.get('/user-growth', getUserGrowth);
router.get('/plan-distribution', getPlanDistribution);
router.get('/activity', getRecentActivity);

module.exports = router;
