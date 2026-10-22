const Transport = require('../models/Transport');

// @desc    Get all transport routes with search by route or boarding point
// @route   GET /api/transport
// @access  Public
const getAllRoutes = async (req, res, next) => {
  try {
    const { search, stop } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { routeName: { $regex: search, $options: 'i' } },
        { routeNumber: { $regex: search, $options: 'i' } },
        { startingPoint: { $regex: search, $options: 'i' } }
      ];
    }

    if (stop) {
      query['stops.stopName'] = { $regex: stop, $options: 'i' };
    }

    const routes = await Transport.find(query).sort({ routeNumber: 1 });

    res.json({
      success: true,
      count: routes.length,
      data: routes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single route by ID
// @route   GET /api/transport/:routeId
// @access  Public
const getRouteById = async (req, res, next) => {
  try {
    const route = await Transport.findById(req.params.routeId);
    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }
    res.json({
      success: true,
      data: route
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create transport route (Admin)
// @route   POST /api/transport
// @access  Private/Admin
const createRoute = async (req, res, next) => {
  try {
    const route = await Transport.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Transport route created successfully!',
      data: route
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update transport route (Admin)
// @route   PUT /api/transport/:routeId
// @access  Private/Admin
const updateRoute = async (req, res, next) => {
  try {
    const route = await Transport.findByIdAndUpdate(req.params.routeId, req.body, {
      new: true,
      runValidators: true
    });
    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }
    res.json({
      success: true,
      message: 'Transport route updated successfully!',
      data: route
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete transport route (Admin)
// @route   DELETE /api/transport/:routeId
// @access  Private/Admin
const deleteRoute = async (req, res, next) => {
  try {
    const route = await Transport.findByIdAndDelete(req.params.routeId);
    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }
    res.json({
      success: true,
      message: 'Transport route deleted successfully!'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute
};
