const Department = require('../models/Department');
const Cutoff = require('../models/Cutoff');
const FeeStructure = require('../models/FeeStructure');

// @desc    Get all departments with optional search and degree filter
// @route   GET /api/departments
// @access  Public
const getAllDepartments = async (req, res, next) => {
  try {
    const { search, degree, sort } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { departmentName: { $regex: search, $options: 'i' } },
        { departmentCode: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (degree && degree !== 'all') {
      query.degree = { $regex: degree, $options: 'i' };
    }

    let sortOption = { departmentName: 1 };
    if (sort === 'intake_desc') sortOption = { intake: -1 };
    if (sort === 'intake_asc') sortOption = { intake: 1 };

    const departments = await Department.find(query).sort(sortOption);

    res.json({
      success: true,
      count: departments.length,
      data: departments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single department with related cutoffs and fees
// @route   GET /api/departments/:id
// @access  Public
const getDepartmentById = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    // Fetch related cutoffs and fee structures
    const cutoffs = await Cutoff.find({ departmentId: department._id }).sort({ academicYear: -1, closingRank: 1 });
    const feeStructure = await FeeStructure.findOne({ departmentId: department._id }).sort({ academicYear: -1 });

    res.json({
      success: true,
      data: {
        department,
        cutoffs,
        feeStructure
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get department statistics for dashboard
// @route   GET /api/departments/stats/summary
// @access  Public
const getDepartmentStats = async (req, res, next) => {
  try {
    const totalDepartments = await Department.countDocuments();
    const totalIntakeResult = await Department.aggregate([
      { $group: { _id: null, totalSeats: { $sum: '$intake' } } }
    ]);
    const popularDepartments = await Department.find({ featured: true }).limit(4);

    res.json({
      success: true,
      totalDepartments,
      totalSeats: totalIntakeResult[0] ? totalIntakeResult[0].totalSeats : 0,
      popularDepartments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create department (Admin)
// @route   POST /api/departments
// @access  Private/Admin
const createDepartment = async (req, res, next) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Department created successfully!',
      data: department
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update department (Admin)
// @route   PUT /api/departments/:id
// @access  Private/Admin
const updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.json({
      success: true,
      message: 'Department updated successfully!',
      data: department
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete department (Admin)
// @route   DELETE /api/departments/:id
// @access  Private/Admin
const deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    // Also clean up associated cutoffs and fee structures
    await Cutoff.deleteMany({ departmentId: req.params.id });
    await FeeStructure.deleteMany({ departmentId: req.params.id });

    res.json({
      success: true,
      message: 'Department and associated data deleted successfully!'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  getDepartmentStats,
  createDepartment,
  updateDepartment,
  deleteDepartment
};
