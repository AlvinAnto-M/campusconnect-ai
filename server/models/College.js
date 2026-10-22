const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    default: 'CAMPUS-01'
  },
  tagline: {
    type: String,
    default: 'Excellence in Engineering, Innovation & Human Values'
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  establishedYear: {
    type: Number,
    required: true
  },
  accreditation: {
    type: String,
    default: 'NAAC A++, NBA Accredited, AICTE Approved'
  },
  ranking: {
    type: String,
    default: 'NIRF Top 50 Engineering Institute'
  },
  website: {
    type: String,
    default: 'https://campusconnect.edu'
  },
  contact: {
    email: { type: String, default: 'admissions@campusconnect.edu' },
    phone: { type: String, default: '+91 44 2855 0100' },
    address: { type: String, default: 'Campus Boulevard, Knowledge City, Chennai - 600025' }
  },
  facilities: [{
    type: String
  }],
  campusHighlights: [{
    title: String,
    count: String,
    icon: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('College', collegeSchema);
