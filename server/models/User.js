const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['Student', 'Prospective Student', 'Admin'],
    default: 'Student'
  },
  phone: {
    type: String,
    default: ''
  },
  counsellingRank: {
    type: Number,
    default: null
  },
  category: {
    type: String,
    enum: ['OC', 'BC', 'BCM', 'MBC', 'SC', 'ST', 'General'],
    default: 'OC'
  },
  favorites: {
    departments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Department' }],
    cutoffs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cutoff' }],
    placements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Placement' }]
  },
  checklist: [{
    documentName: String,
    completed: { type: Boolean, default: false }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
