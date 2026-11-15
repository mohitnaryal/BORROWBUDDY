const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviewsForUser,
  getReviewsForTransaction,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/user/:userId', getReviewsForUser);
router.get('/transaction/:transactionId', protect, getReviewsForTransaction);
router.post('/', protect, createReview);

module.exports = router;
