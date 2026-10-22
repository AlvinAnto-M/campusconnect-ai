const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const cutoffRoutes = require('./routes/cutoffRoutes');
const feeRoutes = require('./routes/feeRoutes');
const hostelRoutes = require('./routes/hostelRoutes');
const transportRoutes = require('./routes/transportRoutes');
const placementRoutes = require('./routes/placementRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const admissionRoutes = require('./routes/admissionRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Standard middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve static frontend files
const clientPath = path.join(__dirname, '../client');
app.use(express.static(clientPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/cutoffs', cutoffRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/hostel', hostelRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/placements', placementRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/admission', admissionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'CampusConnect AI',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// For any non-API route, serve the AngularJS SPA
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientPath, 'index.html'));
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` CAMPUSCONNECT AI - Portal Server`);
  console.log(` Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(` Client URL : http://localhost:${PORT}`);
  console.log(` API Base   : http://localhost:${PORT}/api`);
  console.log(`====================================================`);
});

module.exports = app;
