const express = require('express');
const app = express();

// Middleware - tells Express to parse incoming JSON requests
app.use(express.json());

// Import routes
const userRoutes = require('./routes/userRoutes');

// Mount routes - all user routes start with /users
app.use('/users', userRoutes);

// Health check endpoint - used by AWS to check if service is running
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'user-service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Handle unknown routes - Express 5 compatible way
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;