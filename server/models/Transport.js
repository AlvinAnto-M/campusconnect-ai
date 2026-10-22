const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({
  routeName: {
    type: String,
    required: true,
    trim: true
  },
  routeNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  startingPoint: {
    type: String,
    required: true
  },
  stops: [{
    stopName: { type: String, required: true },
    time: { type: String, required: true },
    landmark: { type: String, default: '' },
    order: { type: Number, default: 0 }
  }],
  timing: {
    type: String,
    default: '6:30 AM (Dep) - 5:15 PM (Campus Dep)'
  },
  distance: {
    type: String,
    default: '32 km'
  },
  fee: {
    type: Number,
    required: true
  },
  availableDays: {
    type: String,
    default: 'Monday to Friday (Saturday on exams)'
  },
  busCapacity: {
    type: Number,
    default: 55
  },
  driverContact: {
    name: { type: String, default: 'Driver Contact' },
    phone: { type: String, default: '+91 94440 55667' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transport', transportSchema);
