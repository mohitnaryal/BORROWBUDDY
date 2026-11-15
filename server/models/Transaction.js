const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BorrowRequest',
      required: true,
      unique: true,
    },
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
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Approved', 'Borrowed', 'Return Requested', 'Completed'],
      default: 'Approved',
      index: true,
    },
    handoverDate: {
      type: Date,
    },
    handoverConfirmedByOwner: {
      type: Boolean,
      default: false,
    },
    handoverConfirmedByBorrower: {
      type: Boolean,
      default: false,
    },
    returnRequestedAt: {
      type: Date,
    },
    actualReturnDate: {
      type: Date,
    },
    returnConfirmedByOwner: {
      type: Boolean,
      default: false,
    },
    isReturnedOnTime: {
      type: Boolean,
      default: true,
    },
    damageReported: {
      type: Boolean,
      default: false,
    },
    damageNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
