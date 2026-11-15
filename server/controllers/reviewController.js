const Review = require('../models/Review');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Helper to recalculate user rating
const updateUserRating = async (userId) => {
  const reviews = await Review.find({ reviewee: userId });
  if (reviews.length === 0) return;

  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = Number((total / reviews.length).toFixed(1));

  await User.findByIdAndUpdate(userId, {
    rating: avgRating,
    totalReviews: reviews.length,
  });
};

// @desc    Submit a review for a completed transaction
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { transactionId, rating, comment, tags = [] } = req.body;

    if (!transactionId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide transactionId, rating (1-5), and written comment',
      });
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    if (transaction.status !== 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Reviews can only be submitted after the transaction is Completed',
      });
    }

    const isBorrower = transaction.borrower.toString() === req.user._id.toString();
    const isOwner = transaction.owner.toString() === req.user._id.toString();

    if (!isBorrower && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this transaction',
      });
    }

    // Determine role and reviewee
    let role;
    let reviewee;
    if (isBorrower) {
      role = 'borrower_to_owner';
      reviewee = transaction.owner;
    } else {
      role = 'owner_to_borrower';
      reviewee = transaction.borrower;
    }

    // Check for existing review by this user on this transaction
    const existingReview = await Review.findOne({
      transaction: transaction._id,
      reviewer: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this transaction',
      });
    }

    const review = await Review.create({
      transaction: transaction._id,
      item: transaction.item,
      reviewer: req.user._id,
      reviewee,
      role,
      rating: Number(rating),
      comment,
      tags: Array.isArray(tags) ? tags : [],
    });

    // Update target user's overall rating
    await updateUserRating(reviewee);

    const populatedReview = await Review.findById(review._id)
      .populate('reviewer', 'name avatar')
      .populate('reviewee', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! Review submitted successfully.',
      review: populatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews received by a user
// @route   GET /api/reviews/user/:userId
// @access  Public
const getReviewsForUser = async (req, res, next) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name avatar city locality')
      .populate('item', 'title category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a transaction
// @route   GET /api/reviews/transaction/:transactionId
// @access  Private
const getReviewsForTransaction = async (req, res, next) => {
  try {
    const reviews = await Review.find({ transaction: req.params.transactionId })
      .populate('reviewer', 'name avatar')
      .populate('reviewee', 'name avatar');

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getReviewsForUser,
  getReviewsForTransaction,
};
