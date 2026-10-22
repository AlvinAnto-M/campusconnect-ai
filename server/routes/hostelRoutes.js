const express = require('express');
const router = express.Router();
const {
  getHostels,
  getHostelById,
  addHostel,
  updateHostel,
  deleteHostel
} = require('../controllers/hostelController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', getHostels);
router.get('/:id', getHostelById);

// Admin operations
router.post('/', protect, adminOnly, addHostel);
router.put('/:id', protect, adminOnly, updateHostel);
router.delete('/:id', protect, adminOnly, deleteHostel);

module.exports = router;
