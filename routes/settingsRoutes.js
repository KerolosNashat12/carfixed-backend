const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  getActivityLog,
} = require('../controllers/settingsController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', authorize('admin'), getSettings);
router.put('/', authorize('admin'), updateSettings);
router.get('/activity', authorize('admin'), getActivityLog);

module.exports = router;
