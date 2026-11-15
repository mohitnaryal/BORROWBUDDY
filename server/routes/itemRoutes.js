const express = require('express');
const router = express.Router();
const {
  getItems,
  getFeaturedItems,
  getMyItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/itemController');
const { getItemPassport } = require('../controllers/passportController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getItems);
router.get('/featured', getFeaturedItems);
router.get('/my', protect, getMyItems);
router.get('/:id/passport', getItemPassport);
router.get('/:id', getItemById);

router.post('/', protect, upload.array('images', 5), createItem);
router.put('/:id', protect, upload.array('images', 5), updateItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;
