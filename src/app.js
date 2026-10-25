const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const { resetData } = require('./data/tasks.data');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static frontend assets from public directory
app.use(express.static(path.join(__dirname, '../public'), { index: false }));

// Root endpoint: serve web UI for browsers, JSON docs for API clients
app.get('/', (req, res) => {
  if (req.accepts('html')) {
    return res.sendFile(path.join(__dirname, '../public/index.html'));
  }
  res.status(200).json({
    success: true,
    message: 'Welcome to Student Task Manager API - SWT301',
    version: '1.0.0',
    documentation: {
      auth: 'POST /api/auth/login or POST /api/login',
      tasks: 'GET, POST /api/tasks | GET, PUT, DELETE /api/tasks/:id'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString()
  });
});

// Reset endpoint for testing convenience
app.post('/api/reset', (req, res) => {
  resetData();
  res.status(200).json({
    success: true,
    message: 'Mock data has been reset to initial state'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', authRoutes); // Allows both /api/auth/login and /api/login
app.use('/api/tasks', taskRoutes);

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message
  });
});

module.exports = app;
