const express = require('express');
const router = express.Router();
const {
  createRequest,
  getSentRequests,
  getReceivedRequests,
  approveRequest,
  rejectRequest,
  cancelRequest,
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All request routes are protected

router.post('/', createRequest);
router.get('/sent', getSentRequests);
router.get('/received', getReceivedRequests);
router.put('/:id/approve', approveRequest);
router.put('/:id/reject', rejectRequest);
router.put('/:id/cancel', cancelRequest);

module.exports = router;
