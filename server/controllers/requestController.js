const BorrowRequest = require('../models/BorrowRequest');
const Transaction = require('../models/Transaction');
const Item = require('../models/Item');

// Helper to check for overlapping active transactions
const hasOverlappingTransaction = async (itemId, startDate, endDate, excludeTransactionId = null) => {
  const query = {
    item: itemId,
    status: { $in: ['Approved', 'Borrowed', 'Return Requested'] },
    startDate: { $lte: new Date(endDate) },
    endDate: { $gte: new Date(startDate) },
  };

  if (excludeTransactionId) {
    query._id = { $ne: excludeTransactionId };
  }

  const conflict = await Transaction.findOne(query);
  return !!conflict;
};

// @desc    Create a new borrow request
// @route   POST /api/requests
// @access  Private
const createRequest = async (req, res, next) => {
  try {
    const { itemId, startDate, endDate, message } = req.body;

    if (!itemId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide itemId, startDate, and endDate',
      });
    }

    const item = await Item.findById(itemId).populate('owner', 'name email');
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Rule: Cannot borrow your own item
    if (item.owner._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot request to borrow your own item!',
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Date sanity checks
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({
        success: false,
        message: 'Borrow start date cannot be in the past',
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: 'Return date must be on or after the start date',
      });
    }

    // Check for date conflicts with already approved transactions
    const isOverlapping = await hasOverlappingTransaction(item._id, start, end);
    if (isOverlapping) {
      return res.status(400).json({
        success: false,
        message:
          'This item is already booked or borrowed during the selected dates. Please choose different dates.',
      });
    }

    // Check if user already has a pending request for this item
    const existingPending = await BorrowRequest.findOne({
      item: item._id,
      borrower: req.user._id,
      status: 'Pending',
    });

    if (existingPending) {
      return res.status(400).json({
        success: false,
        message:
          'You already have a pending borrow request for this item. Please wait for the owner to respond.',
      });
    }

    const diffTime = Math.abs(end - start);
    const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
    const estimatedPrice = totalDays * (item.pricePerDay || 0);

    const borrowRequest = await BorrowRequest.create({
      item: item._id,
      borrower: req.user._id,
      owner: item.owner._id,
      startDate: start,
      endDate: end,
      totalDays,
      estimatedPrice,
      message: message || '',
    });

    const populatedRequest = await BorrowRequest.findById(borrowRequest._id)
      .populate('item', 'title category images pricePerDay city locality')
      .populate('owner', 'name avatar rating phone');

    res.status(201).json({
      success: true,
      message: 'Borrow request submitted successfully! The owner will be notified.',
      request: populatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get requests sent by current user
// @route   GET /api/requests/sent
// @access  Private
const getSentRequests = async (req, res, next) => {
  try {
    const requests = await BorrowRequest.find({ borrower: req.user._id })
      .populate('item', 'title category images pricePerDay city locality condition')
      .populate('owner', 'name avatar rating phone city locality')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get requests received on items owned by current user
// @route   GET /api/requests/received
// @access  Private
const getReceivedRequests = async (req, res, next) => {
  try {
    const requests = await BorrowRequest.find({ owner: req.user._id })
      .populate('item', 'title category images pricePerDay city locality condition')
      .populate('borrower', 'name avatar rating phone city locality bio')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a borrow request
// @route   PUT /api/requests/:id/approve
// @access  Private (Owner only)
const approveRequest = async (req, res, next) => {
  try {
    const request = await BorrowRequest.findById(req.params.id)
      .populate('item')
      .populate('borrower', 'name email phone');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Borrow request not found',
      });
    }

    // Only owner can approve
    if (request.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the item owner can approve this request',
      });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot approve request with current status: ${request.status}`,
      });
    }

    // Re-verify no overlapping transaction exists
    const isOverlapping = await hasOverlappingTransaction(
      request.item._id,
      request.startDate,
      request.endDate
    );

    if (isOverlapping) {
      return res.status(400).json({
        success: false,
        message:
          'Cannot approve request: another approved transaction already overlaps with this date range.',
      });
    }

    // Update request status
    request.status = 'Approved';
    await request.save();

    // Create Transaction record
    const transaction = await Transaction.create({
      request: request._id,
      item: request.item._id,
      borrower: request.borrower._id,
      owner: request.owner,
      startDate: request.startDate,
      endDate: request.endDate,
      status: 'Approved',
    });

    // Automatically decline other conflicting pending requests for same period
    const conflictingPending = await BorrowRequest.find({
      _id: { $ne: request._id },
      item: request.item._id,
      status: 'Pending',
      startDate: { $lte: request.endDate },
      endDate: { $gte: request.startDate },
    });

    for (const confReq of conflictingPending) {
      confReq.status = 'Rejected';
      confReq.rejectionReason = 'Dates overlap with an earlier approved booking';
      await confReq.save();
    }

    res.status(200).json({
      success: true,
      message: 'Borrow request approved! An active transaction has been created.',
      request,
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a borrow request
// @route   PUT /api/requests/:id/reject
// @access  Private (Owner only)
const rejectRequest = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const request = await BorrowRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Borrow request not found',
      });
    }

    if (request.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the item owner can reject this request',
      });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot reject request with status: ${request.status}`,
      });
    }

    request.status = 'Rejected';
    request.rejectionReason = reason || 'Declined by owner';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Borrow request declined',
      request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a borrow request
// @route   PUT /api/requests/:id/cancel
// @access  Private (Borrower only)
const cancelRequest = async (req, res, next) => {
  try {
    const request = await BorrowRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Borrow request not found',
      });
    }

    if (request.borrower.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own borrow requests',
      });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending requests can be cancelled',
      });
    }

    request.status = 'Cancelled';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Borrow request cancelled successfully',
      request,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  getSentRequests,
  getReceivedRequests,
  approveRequest,
  rejectRequest,
  cancelRequest,
};
