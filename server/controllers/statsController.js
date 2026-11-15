const Item = require('../models/Item');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const BorrowRequest = require('../models/BorrowRequest');

// @desc    Get real community stats for landing page
// @route   GET /api/stats/community
// @access  Public
const getCommunityStats = async (req, res, next) => {
  try {
    const [totalItems, totalUsers, completedBorrows, distinctCities] =
      await Promise.all([
        Item.countDocuments(),
        User.countDocuments(),
        Transaction.countDocuments({ status: 'Completed' }),
        Item.distinct('city'),
      ]);

    res.status(200).json({
      success: true,
      stats: {
        totalItems,
        totalUsers,
        completedBorrows,
        citiesCount: Math.max(1, distinctCities.length),
        cities: distinctCities,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get personalized stats for user dashboard
// @route   GET /api/stats/dashboard
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [
      totalListedItems,
      activeBorrowRequests,
      currentlyBorrowed,
      pendingReceivedRequests,
      completedTransactions,
    ] = await Promise.all([
      // Total items listed by this user
      Item.countDocuments({ owner: userId }),
      // Active requests sent by this user
      BorrowRequest.countDocuments({
        borrower: userId,
        status: { $in: ['Pending', 'Approved'] },
      }),
      // Items currently in possession / borrowed by user
      Transaction.countDocuments({
        borrower: userId,
        status: { $in: ['Approved', 'Borrowed', 'Return Requested'] },
      }),
      // Requests received on user items pending approval
      BorrowRequest.countDocuments({
        owner: userId,
        status: 'Pending',
      }),
      // Completed transactions (either as borrower or owner)
      Transaction.countDocuments({
        $or: [{ borrower: userId }, { owner: userId }],
        status: 'Completed',
      }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalListedItems,
        activeBorrowRequests,
        currentlyBorrowed,
        pendingReceivedRequests,
        completedTransactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCommunityStats,
  getDashboardStats,
};
