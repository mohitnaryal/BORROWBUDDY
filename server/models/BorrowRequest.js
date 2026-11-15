const mongoose = require('mongoose');

const borrowRequestSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
      index: true,
    },
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide the start date for borrowing'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide the return date'],
    },
    totalDays: {
      type: Number,
      required: true,
      min: 1,
    },
    estimatedPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    message: {
      type: String,
      default: '',
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
      default: 'Pending',
      index: true,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('BorrowRequest', borrowRequestSchema);
