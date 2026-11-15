const Item = require('../models/Item');
const Transaction = require('../models/Transaction');

// @desc    Get all items with search, filters and pagination
// @route   GET /api/items
// @access  Public
const getItems = async (req, res, next) => {
  try {
    const {
      q,
      category,
      city,
      condition,
      availability,
      priceType,
      sort,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    // Search query on title, description, locality, city
    if (q && q.trim()) {
      filter.$or = [
        { title: { $regex: q.trim(), $options: 'i' } },
        { description: { $regex: q.trim(), $options: 'i' } },
        { locality: { $regex: q.trim(), $options: 'i' } },
        { city: { $regex: q.trim(), $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (city && city !== 'All') {
      filter.city = { $regex: `^${city.trim()}$`, $options: 'i' };
    }

    if (condition && condition !== 'All') {
      filter.condition = condition;
    }

    if (availability === 'available') {
      filter.isAvailable = true;
    }

    if (priceType === 'free') {
      filter.pricePerDay = 0;
    } else if (priceType === 'paid') {
      filter.pricePerDay = { $gt: 0 };
    }

    // Sorting
    let sortQuery = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') {
      sortQuery = { pricePerDay: 1, createdAt: -1 };
    } else if (sort === 'price_desc') {
      sortQuery = { pricePerDay: -1, createdAt: -1 };
    } else if (sort === 'popular') {
      sortQuery = { totalBorrows: -1, createdAt: -1 };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Item.countDocuments(filter);
    const items = await Item.find(filter)
      .populate('owner', 'name avatar city locality rating totalReviews')
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured items for homepage
// @route   GET /api/items/featured
// @access  Public
const getFeaturedItems = async (req, res, next) => {
  try {
    const items = await Item.find({ isAvailable: true })
      .populate('owner', 'name avatar city locality rating')
      .sort({ totalBorrows: -1, createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get items listed by current user
// @route   GET /api/items/my
// @access  Private
const getMyItems = async (req, res, next) => {
  try {
    const items = await Item.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      'owner',
      'name email phone avatar city locality bio rating totalReviews createdAt'
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Check if the item currently has an active borrowing transaction
    const activeTransaction = await Transaction.findOne({
      item: item._id,
      status: { $in: ['Approved', 'Borrowed', 'Return Requested'] },
    }).populate('borrower', 'name');

    res.status(200).json({
      success: true,
      item,
      activeTransaction: activeTransaction || null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new item
// @route   POST /api/items
// @access  Private
const createItem = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      condition,
      city,
      locality,
      pricePerDay,
      securityDeposit,
      borrowingRules,
      images,
    } = req.body;

    let imageList = [];

    // Check if files were uploaded via Multer
    if (req.files && req.files.length > 0) {
      imageList = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (images) {
      // Support string or array of image URLs
      imageList = Array.isArray(images)
        ? images
        : [images];
    }

    if (!imageList || imageList.length === 0) {
      // Default fallback placeholder based on category
      imageList = [
        'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
      ];
    }

    const item = await Item.create({
      title,
      description,
      category,
      condition,
      images: imageList,
      owner: req.user._id,
      city: city || req.user.city,
      locality: locality || req.user.locality,
      pricePerDay: pricePerDay ? Number(pricePerDay) : 0,
      securityDeposit: securityDeposit ? Number(securityDeposit) : 0,
      borrowingRules: borrowingRules || undefined,
    });

    const populatedItem = await Item.findById(item._id).populate(
      'owner',
      'name avatar city locality rating'
    );

    res.status(201).json({
      success: true,
      message: 'Item listed successfully on BorrowBuddy!',
      item: populatedItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an item
// @route   PUT /api/items/:id
// @access  Private
const updateItem = async (req, res, next) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Check ownership
    if (item.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this item',
      });
    }

    const {
      title,
      description,
      category,
      condition,
      city,
      locality,
      pricePerDay,
      securityDeposit,
      borrowingRules,
      isAvailable,
      images,
    } = req.body;

    if (title) item.title = title;
    if (description) item.description = description;
    if (category) item.category = category;
    if (condition) item.condition = condition;
    if (city) item.city = city;
    if (locality) item.locality = locality;
    if (pricePerDay !== undefined) item.pricePerDay = Number(pricePerDay);
    if (securityDeposit !== undefined) item.securityDeposit = Number(securityDeposit);
    if (borrowingRules !== undefined) item.borrowingRules = borrowingRules;
    if (isAvailable !== undefined) item.isAvailable = isAvailable;

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      item.images = newImages;
    } else if (images) {
      item.images = Array.isArray(images) ? images : [images];
    }

    const updatedItem = await item.save();

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      item: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Check ownership
    if (item.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this item',
      });
    }

    // Check if actively borrowed
    const activeTransaction = await Transaction.findOne({
      item: item._id,
      status: { $in: ['Approved', 'Borrowed', 'Return Requested'] },
    });

    if (activeTransaction) {
      return res.status(400).json({
        success: false,
        message:
          'Cannot delete item while it has an active borrowing agreement or ongoing borrow',
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getItems,
  getFeaturedItems,
  getMyItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
