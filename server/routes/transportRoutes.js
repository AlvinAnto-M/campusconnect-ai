const express = require('express');
const router = express.Router();
const {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute
} = require('../controllers/transportController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', getAllRoutes);
router.get('/:routeId', getRouteById);

// Admin operations
router.post('/', protect, adminOnly, createRoute);
router.put('/:routeId', protect, adminOnly, updateRoute);
router.delete('/:routeId', protect, adminOnly, deleteRoute);

module.exports = router;
