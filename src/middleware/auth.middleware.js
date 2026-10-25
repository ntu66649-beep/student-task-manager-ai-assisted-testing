const { VALID_TOKEN } = require('../data/tasks.data');

/**
 * Middleware to authenticate requests using a Bearer token
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Authorization header is missing'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid token format, must be "Bearer <token>"'
    });
  }

  const token = parts[1];
  if (token !== VALID_TOKEN) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or expired token'
    });
  }

  // Token is valid
  req.user = { username: 'student', role: 'student' };
  next();
}

module.exports = { authenticateToken };
