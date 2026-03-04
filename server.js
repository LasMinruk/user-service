const app = require('./src/app');


// Use environment variable for port, or default to 3001
// Environment variables are used in cloud deployments
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`✅ User Service is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`👥 Users endpoint: http://localhost:${PORT}/users`);
});