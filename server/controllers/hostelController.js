const Hostel = require('../models/Hostel');

// @desc    Get all hostels
// @route   GET /api/hostel
// @access  Public
const getHostels = async (req, res, next) => {
  try {
    const { type } = req.query;
    let query = {};
    if (type && type !== 'all') {
      query.type = type;
    }

    const hostels = await Hostel.find(query);
    res.json({
      success: true,
      count: hostels.length,
      data: hostels
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hostel by ID
// @route   GET /api/hostel/:id
// @access  Public
const getHostelById = async (req, res, next) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel block not found' });
    }
    res.json({
      success: true,
      data: hostel
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create hostel (Admin)
// @route   POST /api/hostel
// @access  Private/Admin
const addHostel = async (req, res, next) => {
  try {
    const hostel = await Hostel.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Hostel block added successfully!',
      data: hostel
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update hostel (Admin)
// @route   PUT /api/hostel/:id
// @access  Private/Admin
const updateHostel = async (req, res, next) => {
  try {
    const hostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }
    res.json({
      success: true,
      message: 'Hostel details updated successfully!',
      data: hostel
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete hostel (Admin)
// @route   DELETE /api/hostel/:id
// @access  Private/Admin
const deleteHostel = async (req, res, next) => {
  try {
    const hostel = await Hostel.findByIdAndDelete(req.params.id);
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }
    res.json({
      success: true,
      message: 'Hostel deleted successfully!'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHostels,
  getHostelById,
  addHostel,
  updateHostel,
  deleteHostel
};
