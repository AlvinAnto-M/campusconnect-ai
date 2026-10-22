const mongoose = require('mongoose');

const cutoffSchema = new mongoose.Schema({
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  academicYear: {
    type: Number,
    required: true,
    enum: [2022, 2023, 2024, 2025, 2026]
  },
  category: {
    type: String,
    required: true,
    enum: ['OC', 'BC', 'BCM', 'MBC', 'SC', 'ST']
  },
  quota: {
    type: String,
    required: true,
    default: 'General / State Quota'
  },
  openingRank: {
    type: Number,
    required: true
  },
  closingRank: {
    type: Number,
    required: true
  },
  closingCutoff: {
    type: Number,
    required: true
  },
  counsellingRound: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Composite index for fast searching and uniqueness per year/dept/category/quota
cutoffSchema.index({ departmentId: 1, academicYear: 1, category: 1, quota: 1, counsellingRound: 1 }, { unique: true });

module.exports = mongoose.model('Cutoff', cutoffSchema);
