const express = require('express');
const router = express.Router();
const {
  getAllCutoffs,
  getCutoffsByDepartment,
  predictCutoff,
  getCutoffTrends,
  createCutoff,
  updateCutoff,
  deleteCutoff
} = require('../controllers/cutoffController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', getAllCutoffs);
router.get('/analytics/trends', getCutoffTrends);
router.get('/:departmentId', getCutoffsByDepartment);
router.post('/predict', predictCutoff);

// Admin operations
router.post('/', protect, adminOnly, createCutoff);
router.put('/:id', protect, adminOnly, updateCutoff);
router.delete('/:id', protect, adminOnly, deleteCutoff);

module.exports = router;
