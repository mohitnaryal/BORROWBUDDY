const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an item title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed item description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Electronics',
        'Books',
        'Sports',
        'Tools',
        'Furniture',
        'Travel & Camping',
        'Kitchen',
        'Other',
      ],
    },
    condition: {
      type: String,
      required: [true, 'Please specify the item condition'],
      enum: ['New', 'Like New', 'Good', 'Fair'],
    },
    images: {
      type: [String],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Please provide at least one image of the item',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    city: {
      type: String,
      required: [true, 'Please specify the city where item is available'],
      trim: true,
      index: true,
    },
    locality: {
      type: String,
      required: [true, 'Please specify the locality/area'],
      trim: true,
    },
    pricePerDay: {
      type: Number,
      default: 0, // 0 means Free to borrow!
      min: [0, 'Price per day cannot be negative'],
    },
    securityDeposit: {
      type: Number,
      default: 0,
      min: [0, 'Security deposit cannot be negative'],
    },
    borrowingRules: {
      type: String,
      default: 'Please return the item in the same clean, working condition it was received. Prompt return is appreciated.',
      maxlength: [500, 'Borrowing rules cannot exceed 500 characters'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    totalBorrows: {
      type: Number,
      default: 0,
    },
    damageReportsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Full text search indexing
itemSchema.index({ title: 'text', description: 'text', city: 'text', locality: 'text' });

module.exports = mongoose.model('Item', itemSchema);
