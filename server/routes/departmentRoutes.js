const express = require('express');
const router = express.Router();
const {
  getAllDepartments,
  getDepartmentById,
  getDepartmentStats,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', getAllDepartments);
router.get('/stats/summary', getDepartmentStats);
router.get('/:id', getDepartmentById);

// Admin operations
router.post('/', protect, adminOnly, createDepartment);
router.put('/:id', protect, adminOnly, updateDepartment);
router.delete('/:id', protect, adminOnly, deleteDepartment);

module.exports = router;
