const Placement = require('../models/Placement');

// @desc    Get placements with filters (industry, year, dept, tier, search)
// @route   GET /api/placements
// @access  Public
const getPlacements = async (req, res, next) => {
  try {
    const { industry, hiringYear, department, tier, search } = req.query;
    let query = {};

    if (industry && industry !== 'all') {
      query.industry = industry;
    }

    if (hiringYear && hiringYear !== 'all') {
      query.hiringYear = Number(hiringYear);
    }

    if (tier && tier !== 'all') {
      query.tier = tier;
    }

    if (department && department !== 'all') {
      query.department = department;
    }

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { jobRole: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } }
      ];
    }

    const placements = await Placement.find(query).sort({ hiringYear: -1, maxPackageLPA: -1 });

    res.json({
      success: true,
      count: placements.length,
      data: placements
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get placement statistics for dashboard and analytics
// @route   GET /api/placements/stats
// @access  Public
const getPlacementStats = async (req, res, next) => {
  try {
    const totalCompanies = await Placement.countDocuments();
    const placements = await Placement.find();

    let maxLPA = 0;
    let totalLPA = 0;
    let totalOffers = 0;

    placements.forEach(p => {
      if (p.maxPackageLPA > maxLPA) maxLPA = p.maxPackageLPA;
      totalLPA += p.maxPackageLPA || 0;
      totalOffers += p.offersCount || 0;
    });

    const averageLPA = placements.length > 0 ? (totalLPA / placements.length).toFixed(1) : 0;
    const topRecruiters = await Placement.find().sort({ maxPackageLPA: -1 }).limit(6);
    const superDreamCount = await Placement.countDocuments({ tier: { $regex: 'Super Dream', $options: 'i' } });

    res.json({
      success: true,
      stats: {
        totalCompanies,
        highestPackage: `${maxLPA} LPA`,
        averagePackage: `${averageLPA} LPA`,
        totalOffers,
        superDreamOffers: superDreamCount,
        placementPercentage: '96.4%'
      },
      topRecruiters
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create placement entry (Admin)
// @route   POST /api/placements
// @access  Private/Admin
const createPlacement = async (req, res, next) => {
  try {
    const placement = await Placement.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Placement company record added successfully!',
      data: placement
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update placement entry (Admin)
// @route   PUT /api/placements/:id
// @access  Private/Admin
const updatePlacement = async (req, res, next) => {
  try {
    const placement = await Placement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!placement) {
      return res.status(404).json({ success: false, message: 'Placement record not found' });
    }
    res.json({
      success: true,
      message: 'Placement company record updated successfully!',
      data: placement
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete placement entry (Admin)
// @route   DELETE /api/placements/:id
// @access  Private/Admin
const deletePlacement = async (req, res, next) => {
  try {
    const placement = await Placement.findByIdAndDelete(req.params.id);
    if (!placement) {
      return res.status(404).json({ success: false, message: 'Placement record not found' });
    }
    res.json({
      success: true,
      message: 'Placement company record deleted successfully!'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlacements,
  getPlacementStats,
  createPlacement,
  updatePlacement,
  deletePlacement
};
