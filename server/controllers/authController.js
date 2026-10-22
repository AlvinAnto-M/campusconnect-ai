const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'campusconnect_super_secret_jwt_key_2026_secure', {
    expiresIn: '7d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, counsellingRank, category } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const defaultChecklist = [
      { documentName: '10th Standard Mark Sheet', completed: false },
      { documentName: '12th Standard / HSC Mark Sheet', completed: false },
      { documentName: 'Transfer Certificate (TC)', completed: false },
      { documentName: 'Community / Caste Certificate', completed: false },
      { documentName: 'Nativity / Domicile Certificate', completed: false },
      { documentName: 'Income Certificate (for Fee Waiver/Scholarship)', completed: false },
      { documentName: 'Government ID Proof (Aadhaar / Passport)', completed: false },
      { documentName: 'Passport Size Photographs (6 copies)', completed: false },
      { documentName: 'Counselling Call Letter / Allotment Order', completed: false }
    ];

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'Student',
      phone: phone || '',
      counsellingRank: counsellingRank ? Number(counsellingRank) : null,
      category: category || 'OC',
      checklist: defaultChecklist
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        counsellingRank: user.counsellingRank,
        category: user.category,
        favorites: user.favorites,
        checklist: user.checklist
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).populate('favorites.departments');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        counsellingRank: user.counsellingRank,
        category: user.category,
        favorites: user.favorites,
        checklist: user.checklist
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('favorites.departments')
      .populate('favorites.cutoffs')
      .populate('favorites.placements');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile & rank
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, counsellingRank, category } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (counsellingRank !== undefined) user.counsellingRank = counsellingRank ? Number(counsellingRank) : null;
    if (category) user.category = category;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        counsellingRank: user.counsellingRank,
        category: user.category,
        favorites: user.favorites,
        checklist: user.checklist
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle favorite item (department, cutoff, placement)
// @route   POST /api/auth/favorite
// @access  Private
const toggleFavorite = async (req, res, next) => {
  try {
    const { type, itemId } = req.body; // type: 'departments' | 'cutoffs' | 'placements'
    if (!type || !itemId || !['departments', 'cutoffs', 'placements'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid favorite type or item ID.' });
    }

    const user = await User.findById(req.user.id);
    const list = user.favorites[type] || [];
    const index = list.findIndex(id => id.toString() === itemId.toString());

    let isFavorited = false;
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(itemId);
      isFavorited = true;
    }

    user.favorites[type] = list;
    await user.save();

    res.json({
      success: true,
      message: isFavorited ? 'Added to favorites!' : 'Removed from favorites!',
      isFavorited,
      favorites: user.favorites
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update readiness checklist
// @route   PUT /api/auth/checklist
// @access  Private
const updateChecklist = async (req, res, next) => {
  try {
    const { checklist } = req.body;
    if (!Array.isArray(checklist)) {
      return res.status(400).json({ success: false, message: 'Checklist must be an array.' });
    }

    const user = await User.findById(req.user.id);
    user.checklist = checklist;
    await user.save();

    res.json({
      success: true,
      message: 'Admission checklist updated successfully!',
      checklist: user.checklist
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  toggleFavorite,
  updateChecklist
};
