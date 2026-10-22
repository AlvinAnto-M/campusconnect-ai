const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Admin privileges required to perform this action.'
    });
  }
};

module.exports = { adminOnly };
