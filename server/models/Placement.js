const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  industry: {
    type: String,
    required: true,
    enum: [
      'Product Companies',
      'IT & Cloud Services',
      'Core Engineering',
      'Consulting & Analytics',
      'Finance & FinTech',
      'Automotive & EV'
    ]
  },
  package: {
    type: String,
    required: true
  },
  minPackageLPA: {
    type: Number,
    default: 6.0
  },
  maxPackageLPA: {
    type: Number,
    default: 15.0
  },
  jobRole: {
    type: String,
    required: true
  },
  hiringYear: {
    type: Number,
    required: true,
    enum: [2023, 2024, 2025, 2026]
  },
  department: [{
    type: String,
    required: true
  }],
  website: {
    type: String,
    default: 'https://careers.google.com'
  },
  tier: {
    type: String,
    enum: ['Super Dream (15+ LPA)', 'Dream (8-15 LPA)', 'Regular (4-8 LPA)'],
    default: 'Dream (8-15 LPA)'
  },
  offersCount: {
    type: Number,
    default: 10
  },
  selectionProcess: {
    type: String,
    default: 'Online Assessment -> Technical Round 1 -> Technical Round 2 -> HR Round'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Placement', placementSchema);
