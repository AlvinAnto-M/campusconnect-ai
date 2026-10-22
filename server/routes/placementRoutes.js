const express = require('express');
const router = express.Router();
const {
  getPlacements,
  getPlacementStats,
  createPlacement,
  updatePlacement,
  deletePlacement
} = require('../controllers/placementController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', getPlacements);
router.get('/stats/summary', getPlacementStats);

// Admin operations
router.post('/', protect, adminOnly, createPlacement);
router.put('/:id', protect, adminOnly, updatePlacement);
router.delete('/:id', protect, adminOnly, deletePlacement);

module.exports = router;
