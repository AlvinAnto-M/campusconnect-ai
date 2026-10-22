const express = require('express');
const router = express.Router();
const {
  getAllFees,
  getFeesByDepartment,
  calculateCost,
  compareFees,
  createFee,
  updateFee,
  deleteFee
} = require('../controllers/feesController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', getAllFees);
router.get('/:departmentId', getFeesByDepartment);
router.post('/calculate', calculateCost);
router.post('/compare', compareFees);

// Admin operations
router.post('/', protect, adminOnly, createFee);
router.put('/:id', protect, adminOnly, updateFee);
router.delete('/:id', protect, adminOnly, deleteFee);

module.exports = router;
