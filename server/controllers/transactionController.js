const Transaction = require('../models/Transaction');
const Item = require('../models/Item');
const Review = require('../models/Review');

// @desc    Get all transactions for current user (as borrower or owner)
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res, next) => {
  try {
    const { status, role } = req.query;
    const query = {
      $or: [{ borrower: req.user._id }, { owner: req.user._id }],
    };

    if (role === 'borrower') {
      query.$or = [{ borrower: req.user._id }];
    } else if (role === 'owner') {
      query.$or = [{ owner: req.user._id }];
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const transactions = await Transaction.find(query)
      .populate('item', 'title category images pricePerDay condition city locality')
      .populate('borrower', 'name email phone avatar city locality rating')
      .populate('owner', 'name email phone avatar city locality rating')
      .populate('request', 'totalDays estimatedPrice message')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('item')
      .populate('borrower', 'name email phone avatar city locality rating totalReviews')
      .populate('owner', 'name email phone avatar city locality rating totalReviews')
      .populate('request');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    const isAuthorized =
      transaction.borrower._id.toString() === req.user._id.toString() ||
      transaction.owner._id.toString() === req.user._id.toString() ||
      req.user.role === 'admin';

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this transaction',
      });
    }

    // Check if the current user has already submitted a review
    const userReview = await Review.findOne({
      transaction: transaction._id,
      reviewer: req.user._id,
    });

    res.status(200).json({
      success: true,
      transaction,
      hasReviewed: !!userReview,
      userReview: userReview || null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm item handover
// @route   PUT /api/transactions/:id/handover
// @access  Private (Owner or Borrower)
const confirmHandover = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    const isBorrower = transaction.borrower.toString() === req.user._id.toString();
    const isOwner = transaction.owner.toString() === req.user._id.toString();

    if (!isBorrower && !isOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not part of this transaction',
      });
    }

    if (transaction.status !== 'Approved') {
      return res.status(400).json({
        success: false,
        message: `Item handover cannot be confirmed when status is '${transaction.status}'`,
      });
    }

    if (isOwner) transaction.handoverConfirmedByOwner = true;
    if (isBorrower) transaction.handoverConfirmedByBorrower = true;

    // Either party confirming or both confirms status transition
    transaction.status = 'Borrowed';
    transaction.handoverDate = new Date();

    await transaction.save();

    // Mark item currently unavailable
    await Item.findByIdAndUpdate(transaction.item, { isAvailable: false });

    const updated = await Transaction.findById(transaction._id)
      .populate('item', 'title category images')
      .populate('borrower', 'name email phone avatar')
      .populate('owner', 'name email phone avatar');

    res.status(200).json({
      success: true,
      message: 'Item handover confirmed! Status updated to Borrowed.',
      transaction: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Borrower requests / initiates item return
// @route   PUT /api/transactions/:id/return
// @access  Private (Borrower)
const requestReturn = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    const isBorrower = transaction.borrower.toString() === req.user._id.toString();
    if (!isBorrower && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the borrower can request or signal item return',
      });
    }

    if (transaction.status !== 'Borrowed') {
      return res.status(400).json({
        success: false,
        message: `Cannot request return for transaction in '${transaction.status}' state`,
      });
    }

    transaction.status = 'Return Requested';
    transaction.returnRequestedAt = new Date();
    await transaction.save();

    const updated = await Transaction.findById(transaction._id)
      .populate('item', 'title category images')
      .populate('borrower', 'name email phone avatar')
      .populate('owner', 'name email phone avatar');

    res.status(200).json({
      success: true,
      message: 'Return requested! Please meet the owner to hand back the item.',
      transaction: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Owner confirms receipt of returned item (completes transaction)
// @route   PUT /api/transactions/:id/confirm-return
// @access  Private (Owner only)
const confirmReturn = async (req, res, next) => {
  try {
    const { damageReported = false, damageNotes = '' } = req.body;
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    const isOwner = transaction.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the item owner can confirm the return of the item',
      });
    }

    if (!['Borrowed', 'Return Requested'].includes(transaction.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot complete return when status is '${transaction.status}'`,
      });
    }

    const actualReturn = new Date();
    transaction.actualReturnDate = actualReturn;
    transaction.returnConfirmedByOwner = true;
    transaction.status = 'Completed';

    // Check if returned on-time (within scheduled endDate + 24hr buffer)
    const scheduledEnd = new Date(transaction.endDate);
    const endWithBuffer = new Date(scheduledEnd.getTime() + 24 * 60 * 60 * 1000);
    transaction.isReturnedOnTime = actualReturn <= endWithBuffer;

    if (damageReported) {
      transaction.damageReported = true;
      transaction.damageNotes = damageNotes;
    }

    await transaction.save();

    // Update item: availability, total borrows count, damage reports count
    const itemUpdate = {
      isAvailable: true,
      $inc: { totalBorrows: 1 },
    };

    if (damageReported) {
      itemUpdate.$inc.damageReportsCount = 1;
    }

    await Item.findByIdAndUpdate(transaction.item, itemUpdate);

    const updated = await Transaction.findById(transaction._id)
      .populate('item', 'title category images')
      .populate('borrower', 'name email phone avatar')
      .populate('owner', 'name email phone avatar');

    res.status(200).json({
      success: true,
      message: 'Item return confirmed! Transaction is now Completed.',
      transaction: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  confirmHandover,
  requestReturn,
  confirmReturn,
};
