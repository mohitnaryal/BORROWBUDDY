const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getTransactionById,
  confirmHandover,
  requestReturn,
  confirmReturn,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All transaction routes are protected

router.get('/', getTransactions);
router.get('/:id', getTransactionById);
router.put('/:id/handover', confirmHandover);
router.put('/:id/return', requestReturn);
router.put('/:id/confirm-return', confirmReturn);

module.exports = router;
