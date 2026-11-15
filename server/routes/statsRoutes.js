const express = require('express');
const router = express.Router();
const {
  getCommunityStats,
  getDashboardStats,
} = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/community', getCommunityStats);
router.get('/dashboard', protect, getDashboardStats);

module.exports = router;
