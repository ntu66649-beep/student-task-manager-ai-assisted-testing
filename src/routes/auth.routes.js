const express = require('express');
const router = express.Router();
const { mockUsers, VALID_TOKEN } = require('../data/tasks.data');

/**
 * @route   POST /api/auth/login (or /api/login)
 * @desc    Authenticate user & return mock token
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validation: Missing fields
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required'
    });
  }

  // Find user
  const user = mockUsers.find(
    (u) => u.username === username.trim() && u.password === password
  );

  // Authentication failure
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid username or password'
    });
  }

  // Authentication success
  return res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      token: VALID_TOKEN,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    }
  });
});

module.exports = router;
