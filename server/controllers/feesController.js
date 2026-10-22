const FeeStructure = require('../models/FeeStructure');
const Department = require('../models/Department');
const Hostel = require('../models/Hostel');
const Transport = require('../models/Transport');

// @desc    Get all fee structures
// @route   GET /api/fees
// @access  Public
const getAllFees = async (req, res, next) => {
  try {
    const fees = await FeeStructure.find()
      .populate('departmentId', 'departmentName departmentCode degree intake duration')
      .sort({ totalAnnualFee: 1 });

    res.json({
      success: true,
      count: fees.length,
      data: fees
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get fees by department ID
// @route   GET /api/fees/:departmentId
// @access  Public
const getFeesByDepartment = async (req, res, next) => {
  try {
    const fee = await FeeStructure.findOne({ departmentId: req.params.departmentId })
      .populate('departmentId', 'departmentName departmentCode degree intake');

    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee structure not found for this department' });
    }

    res.json({
      success: true,
      data: fee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Interactive Student College Cost Calculator (FEATURE 2)
// @route   POST /api/fees/calculate
// @access  Public
const calculateCost = async (req, res, next) => {
  try {
    const {
      departmentId,
      years = 4,
      hostelRequired = false,
      hostelRoomFee = 85000,
      transportRequired = false,
      transportRouteFee = 32000,
      scholarshipPercent = 0
    } = req.body;

    if (!departmentId) {
      return res.status(400).json({ success: false, message: 'Department ID is required.' });
    }

    const fee = await FeeStructure.findOne({ departmentId }).populate('departmentId');
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee structure not found for selected department.' });
    }

    const numYears = Number(years) || 4;
    const annualTuition = fee.tuitionFee;
    const annualExam = fee.examinationFee;
    const annualOther = fee.otherFees;
    const baseAnnualAcademic = annualTuition + annualExam + annualOther;

    // Apply scholarship on tuition
    const discountAnnual = (annualTuition * (Number(scholarshipPercent) || 0)) / 100;
    const netAnnualTuition = annualTuition - discountAnnual;
    const netAnnualAcademic = netAnnualTuition + annualExam + annualOther;

    const annualHostel = hostelRequired ? Number(hostelRoomFee) : 0;
    const annualTransport = transportRequired ? Number(transportRouteFee) : 0;

    const netAnnualTotal = netAnnualAcademic + annualHostel + annualTransport;
    const totalProgramCost = netAnnualTotal * numYears;

    res.json({
      success: true,
      data: {
        department: fee.departmentId.departmentName,
        degree: fee.departmentId.degree,
        years: numYears,
        annualBreakdown: {
          tuitionFee: annualTuition,
          scholarshipDiscount: discountAnnual,
          netTuitionFee: netAnnualTuition,
          examinationFee: annualExam,
          otherFees: annualOther,
          totalAnnualAcademic: netAnnualAcademic,
          hostelFee: annualHostel,
          transportFee: annualTransport,
          totalAnnualEstimate: netAnnualTotal
        },
        programSummary: {
          totalAcademicCost: netAnnualAcademic * numYears,
          totalHostelCost: annualHostel * numYears,
          totalTransportCost: annualTransport * numYears,
          totalScholarshipSavings: discountAnnual * numYears,
          grandTotalEstimatedCost: totalProgramCost
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Compare multiple departments fees (up to 3)
// @route   POST /api/fees/compare
// @access  Public
const compareFees = async (req, res, next) => {
  try {
    const { departmentIds } = req.body;
    if (!departmentIds || !Array.isArray(departmentIds) || departmentIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Provide an array of department IDs to compare.' });
    }

    const feeList = await FeeStructure.find({ departmentId: { $in: departmentIds } })
      .populate('departmentId');

    res.json({
      success: true,
      count: feeList.length,
      data: feeList
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create fee structure (Admin)
// @route   POST /api/fees
// @access  Private/Admin
const createFee = async (req, res, next) => {
  try {
    const fee = await FeeStructure.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Fee structure created successfully!',
      data: fee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update fee structure (Admin)
// @route   PUT /api/fees/:id
// @access  Private/Admin
const updateFee = async (req, res, next) => {
  try {
    const fee = await FeeStructure.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee structure not found' });
    }
    res.json({
      success: true,
      message: 'Fee structure updated successfully!',
      data: fee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete fee structure (Admin)
// @route   DELETE /api/fees/:id
// @access  Private/Admin
const deleteFee = async (req, res, next) => {
  try {
    const fee = await FeeStructure.findByIdAndDelete(req.params.id);
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee structure not found' });
    }
    res.json({
      success: true,
      message: 'Fee structure deleted successfully!'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFees,
  getFeesByDepartment,
  calculateCost,
  compareFees,
  createFee,
  updateFee,
  deleteFee
};
