const express = require('express');
const helmet = require('helmet');
const setupSwagger = require('./config/swagger');
const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false  // disabled so Swagger UI loads correctly
}));
app.use(express.json());

// Swagger docs — available at /api-docs
setupSwagger(app);

// Import routes
const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'user-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    docs: '/api-docs'
  });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;
