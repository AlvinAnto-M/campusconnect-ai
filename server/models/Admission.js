const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  admissionYear: {
    type: Number,
    required: true,
    default: 2026
  },
  title: {
    type: String,
    default: 'Undergraduate B.E. / B.Tech Admissions 2026'
  },
  eligibility: {
    type: String,
    required: true
  },
  counsellingProcess: [{
    stepNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true }
  }],
  requiredDocuments: [{
    name: { type: String, required: true },
    mandatory: { type: Boolean, default: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'Academic' }
  }],
  importantDates: [{
    event: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ['Completed', 'Ongoing', 'Upcoming'], default: 'Upcoming' }
  }],
  helpline: {
    phone: { type: String, default: '+91 44 2855 0101' },
    email: { type: String, default: 'admissions@campusconnect.edu' },
    timings: { type: String, default: 'Mon-Sat: 9:00 AM - 5:00 PM' },
    address: { type: String, default: 'Admissions Block, Ground Floor, CampusConnect' }
  },
  faqList: [{
    question: String,
    answer: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Admission', admissionSchema);
