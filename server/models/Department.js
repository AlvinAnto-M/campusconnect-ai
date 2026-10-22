const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  departmentName: {
    type: String,
    required: true,
    trim: true
  },
  departmentCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    default: 'B.Tech / B.E.'
  },
  duration: {
    type: String,
    default: '4 Years'
  },
  intake: {
    type: Number,
    required: true,
    default: 120
  },
  eligibility: {
    type: String,
    default: 'Passed 10+2 with Physics, Mathematics & Chemistry (Min 60% aggregate)'
  },
  facilities: [{
    type: String
  }],
  careerOptions: [{
    type: String
  }],
  hod: {
    name: { type: String, default: 'Dr. Senior Professor, Ph.D.' },
    email: { type: String, default: 'hod@campusconnect.edu' },
    qualification: { type: String, default: 'Ph.D., Post-Doc (IISc)' }
  },
  labs: [{
    type: String
  }],
  icon: {
    type: String,
    default: 'fa-laptop-code'
  },
  color: {
    type: String,
    default: '#2563eb'
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Department', departmentSchema);
