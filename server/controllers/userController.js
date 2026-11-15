const User = require('../models/User');
const Item = require('../models/Item');
const Review = require('../models/Review');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, phone, city, locality, bio, avatar } = req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (city) user.city = city;
    if (locality) user.locality = locality;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public user profile with their items & reviews
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      'name avatar city locality bio rating totalReviews createdAt'
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get active items listed by this user
    const items = await Item.find({ owner: user._id }).sort({ createdAt: -1 });

    // Get reviews received by this user
    const reviews = await Review.find({ reviewee: user._id })
      .populate('reviewer', 'name avatar')
      .populate('item', 'title category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      user,
      items,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserById,
};
