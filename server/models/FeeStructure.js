const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema({
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  academicYear: {
    type: Number,
    required: true
  },
  tuitionFee: {
    type: Number,
    required: true
  },
  hostelFee: {
    type: Number,
    default: 85000
  },
  transportFee: {
    type: Number,
    default: 32000
  },
  examinationFee: {
    type: Number,
    default: 6000
  },
  otherFees: {
    type: Number,
    default: 15000
  },
  totalAnnualFee: {
    type: Number,
    required: true
  },
  scholarshipAvailable: {
    type: Boolean,
    default: true
  },
  scholarshipDetails: {
    type: String,
    default: 'Merit scholarship up to 50% for top 5% rank holders and government quota concessions.'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Auto calculate total before save if not explicitly given
feeStructureSchema.pre('save', function (next) {
  if (!this.totalAnnualFee) {
    this.totalAnnualFee = this.tuitionFee + (this.examinationFee || 0) + (this.otherFees || 0);
  }
  next();
});

module.exports = mongoose.model('FeeStructure', feeStructureSchema);
