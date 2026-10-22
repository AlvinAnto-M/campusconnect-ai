const express = require('express');
const router = express.Router();
const {
  getAdmissionInfo,
  updateAdmissionInfo,
  getCollegeInfo
} = require('../controllers/admissionController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', getAdmissionInfo);
router.get('/college', getCollegeInfo);
router.put('/', protect, adminOnly, updateAdmissionInfo);

module.exports = router;
