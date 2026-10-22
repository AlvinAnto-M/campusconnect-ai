const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  hostelName: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Boys', 'Girls', 'Co-ed'],
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  availableBeds: {
    type: Number,
    default: 45
  },
  roomTypes: [{
    typeName: { type: String, required: true }, // e.g., '2-Sharing AC', '3-Sharing Non-AC'
    occupancy: { type: Number, required: true },
    fee: { type: Number, required: true },
    isAc: { type: Boolean, default: false },
    available: { type: Boolean, default: true }
  }],
  fees: {
    type: Number,
    required: true // Annual base hostel fee
  },
  facilities: [{
    type: String
  }],
  messDetails: {
    messType: { type: String, default: 'South & North Indian (Veg & Non-Veg)' },
    cuisine: [{ type: String }],
    timings: { type: String, default: 'Breakfast: 7:30-9:00 AM | Lunch: 12:30-2:00 PM | Dinner: 7:30-9:30 PM' },
    dietaryNotes: { type: String, default: 'Clean RO purified drinking water, weekly special feasts' }
  },
  rules: [{
    type: String
  }],
  contact: {
    wardenName: { type: String, default: 'Chief Warden' },
    phone: { type: String, default: '+91 98400 12345' },
    email: { type: String, default: 'hostels@campusconnect.edu' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hostel', hostelSchema);
