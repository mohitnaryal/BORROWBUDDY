const Item = require('../models/Item');
const Transaction = require('../models/Transaction');
const Review = require('../models/Review');

// @desc    Get Borrowing Passport for an item
// @route   GET /api/items/:id/passport
// @access  Public
const getItemPassport = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      'owner',
      'name avatar city locality rating totalReviews createdAt'
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Fetch verified completed transactions
    const completedTransactions = await Transaction.find({
      item: item._id,
      status: 'Completed',
    })
      .populate('borrower', 'name avatar city')
      .sort({ actualReturnDate: -1 });

    const totalBorrows = completedTransactions.length;

    // Calculate on-time return metrics
    const onTimeCount = completedTransactions.filter(
      (tx) => tx.isReturnedOnTime
    ).length;

    const onTimeRate =
      totalBorrows > 0 ? Math.round((onTimeCount / totalBorrows) * 100) : 100;

    // Damage incident records
    const damageIncidents = completedTransactions
      .filter((tx) => tx.damageReported)
      .map((tx) => ({
        date: tx.actualReturnDate,
        notes: tx.damageNotes,
        borrowerName: tx.borrower ? tx.borrower.name : 'Community Member',
      }));

    // Fetch reviews specifically for this item
    const itemReviews = await Review.find({ item: item._id })
      .populate('reviewer', 'name avatar city')
      .sort({ createdAt: -1 });

    // Trust Score Calculation (out of 100)
    // Starts at 85 base for new items; boosts with successful borrows and on-time rate; penalized by damage
    let trustScore = 85;
    if (totalBorrows > 0) {
      trustScore = Math.min(
        100,
        Math.max(
          50,
          Math.round(
            70 +
              Math.min(20, totalBorrows * 3) +
              (onTimeRate / 100) * 10 -
              damageIncidents.length * 15
          )
        )
      );
    }

    // Verified timeline entries
    const historyTimeline = completedTransactions.map((tx) => ({
      transactionId: tx._id,
      startDate: tx.startDate,
      returnDate: tx.actualReturnDate || tx.endDate,
      durationDays: Math.max(
        1,
        Math.ceil(
          (new Date(tx.endDate) - new Date(tx.startDate)) /
            (1000 * 60 * 60 * 24)
        ) + 1
      ),
      borrowerName: tx.borrower ? tx.borrower.name : 'Verified Member',
      borrowerAvatar: tx.borrower ? tx.borrower.avatar : null,
      borrowerCity: tx.borrower ? tx.borrower.city : null,
      onTime: tx.isReturnedOnTime,
      damageReported: tx.damageReported,
    }));

    res.status(200).json({
      success: true,
      passport: {
        item: {
          _id: item._id,
          title: item.title,
          category: item.category,
          condition: item.condition,
          images: item.images,
          listedDate: item.createdAt,
          pricePerDay: item.pricePerDay,
          city: item.city,
          locality: item.locality,
          owner: item.owner,
        },
        metrics: {
          totalBorrows,
          onTimeRate,
          onTimeCount,
          damageReportsCount: damageIncidents.length,
          trustScore,
          verificationSeal:
            damageIncidents.length === 0 && onTimeRate >= 95
              ? 'Gold Verified Badge'
              : 'Community Certified',
        },
        damageRecords: damageIncidents,
        history: historyTimeline,
        reviews: itemReviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getItemPassport,
};
