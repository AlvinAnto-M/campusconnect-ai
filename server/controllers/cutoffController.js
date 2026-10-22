const Cutoff = require('../models/Cutoff');
const Department = require('../models/Department');

// @desc    Get all cutoffs with flexible filters
// @route   GET /api/cutoffs
// @access  Public
const getAllCutoffs = async (req, res, next) => {
  try {
    const { departmentId, academicYear, category, quota } = req.query;
    let query = {};

    if (departmentId && departmentId !== 'all') query.departmentId = departmentId;
    if (academicYear && academicYear !== 'all') query.academicYear = Number(academicYear);
    if (category && category !== 'all') query.category = category;
    if (quota && quota !== 'all') query.quota = quota;

    const cutoffs = await Cutoff.find(query)
      .populate('departmentId', 'departmentName departmentCode degree')
      .sort({ academicYear: -1, closingCutoff: -1 });

    res.json({
      success: true,
      count: cutoffs.length,
      data: cutoffs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get cutoffs for a specific department
// @route   GET /api/cutoffs/:departmentId
// @access  Public
const getCutoffsByDepartment = async (req, res, next) => {
  try {
    const cutoffs = await Cutoff.find({ departmentId: req.params.departmentId })
      .populate('departmentId', 'departmentName departmentCode')
      .sort({ academicYear: -1, category: 1 });

    res.json({
      success: true,
      data: cutoffs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Predict Admission Likelihood ("Can I Get This Department?")
// @route   POST /api/cutoffs/predict
// @access  Public
const predictCutoff = async (req, res, next) => {
  try {
    const { counsellingRank, category, quota, departmentId } = req.body;

    if (!counsellingRank || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both counselling rank and category (e.g. OC, BC, MBC, SC, ST).'
      });
    }

    const rank = Number(counsellingRank);
    let deptQuery = {};
    if (departmentId && departmentId !== 'all') {
      deptQuery._id = departmentId;
    }

    const departments = await Department.find(deptQuery);
    const predictions = [];

    for (const dept of departments) {
      // Find latest cutoffs for this department and category
      const latestCutoffs = await Cutoff.find({
        departmentId: dept._id,
        category: category,
        ...(quota && quota !== 'all' ? { quota } : {})
      }).sort({ academicYear: -1, counsellingRound: 1 });

      if (latestCutoffs.length > 0) {
        // Average or use most recent closing rank
        const mostRecent = latestCutoffs[0];
        const closingRank = mostRecent.closingRank;
        const closingCutoff = mostRecent.closingCutoff;

        let status = 'Historical cutoff exceeded';
        let badgeColor = 'danger';
        let likelihoodScore = 20;
        let advice = 'Historical closing rank was significantly higher. Consider keeping this as an ambitious choice.';

        if (rank <= closingRank * 0.90) {
          status = 'Likely';
          badgeColor = 'success';
          likelihoodScore = 90;
          advice = 'Strong historical alignment. High probability based on previous closing ranks.';
        } else if (rank <= closingRank * 1.05) {
          status = 'Borderline';
          badgeColor = 'warning';
          likelihoodScore = 55;
          advice = 'Near the cutoff boundary. May clear in Round 2 or 3 counselling depending on vacancy.';
        }

        predictions.push({
          department: {
            id: dept._id,
            name: dept.departmentName,
            code: dept.departmentCode,
            degree: dept.degree,
            intake: dept.intake
          },
          status,
          badgeColor,
          likelihoodScore,
          advice,
          studentRank: rank,
          historicalClosingRank: closingRank,
          closingCutoffScore: closingCutoff,
          referenceYear: mostRecent.academicYear,
          category: mostRecent.category,
          quota: mostRecent.quota,
          historicalRecords: latestCutoffs
        });
      }
    }

    // Sort predictions: Likely first, then Borderline, then Exceeded
    const sortPriority = { 'Likely': 1, 'Borderline': 2, 'Historical cutoff exceeded': 3 };
    predictions.sort((a, b) => sortPriority[a.status] - sortPriority[b.status]);

    res.json({
      success: true,
      disclaimer: 'DISCLAIMER: This analysis is an algorithmic historical-data-based guidance tool and NOT a guaranteed admission prediction. Final seat allotment depends on official state counselling authority seat matrix and candidate choices.',
      studentRank: rank,
      category,
      totalEvaluated: predictions.length,
      predictions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get historical cutoff trends for multi-department analytics
// @route   GET /api/cutoffs/analytics/trends
// @access  Public
const getCutoffTrends = async (req, res, next) => {
  try {
    const { category = 'OC', quota = 'General / State Quota' } = req.query;

    const departments = await Department.find().limit(6);
    const years = [2023, 2024, 2025, 2026];

    const datasets = [];

    for (const dept of departments) {
      const yearlyRanks = [];
      const yearlyScores = [];

      for (const year of years) {
        const record = await Cutoff.findOne({
          departmentId: dept._id,
          academicYear: year,
          category,
          quota
        });

        yearlyRanks.push(record ? record.closingRank : null);
        yearlyScores.push(record ? record.closingCutoff : null);
      }

      datasets.push({
        departmentId: dept._id,
        departmentName: dept.departmentName,
        departmentCode: dept.departmentCode,
        color: dept.color || '#3b82f6',
        closingRanks: yearlyRanks,
        closingCutoffs: yearlyScores
      });
    }

    res.json({
      success: true,
      category,
      quota,
      years,
      datasets
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new cutoff entry (Admin)
// @route   POST /api/cutoffs
// @access  Private/Admin
const createCutoff = async (req, res, next) => {
  try {
    const cutoff = await Cutoff.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Cutoff entry recorded successfully!',
      data: cutoff
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cutoff entry (Admin)
// @route   PUT /api/cutoffs/:id
// @access  Private/Admin
const updateCutoff = async (req, res, next) => {
  try {
    const cutoff = await Cutoff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!cutoff) {
      return res.status(404).json({ success: false, message: 'Cutoff record not found' });
    }
    res.json({
      success: true,
      message: 'Cutoff updated successfully!',
      data: cutoff
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete cutoff entry (Admin)
// @route   DELETE /api/cutoffs/:id
// @access  Private/Admin
const deleteCutoff = async (req, res, next) => {
  try {
    const cutoff = await Cutoff.findByIdAndDelete(req.params.id);
    if (!cutoff) {
      return res.status(404).json({ success: false, message: 'Cutoff record not found' });
    }
    res.json({
      success: true,
      message: 'Cutoff record deleted successfully!'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCutoffs,
  getCutoffsByDepartment,
  predictCutoff,
  getCutoffTrends,
  createCutoff,
  updateCutoff,
  deleteCutoff
};
