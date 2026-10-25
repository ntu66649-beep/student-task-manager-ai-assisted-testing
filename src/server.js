const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Student Task Manager API is running on port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📚 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔑 Login endpoint: http://localhost:${PORT}/api/login`);
  console.log(`📋 Tasks endpoint: http://localhost:${PORT}/api/tasks`);
  console.log(`====================================================`);
});
