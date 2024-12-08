const jwt = require('jwt-simple');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    // Decode the token
    const decoded = jwt.decode(token, process.env.JWT_SECRET);

    // Check if the token is expired
    const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
    if (decoded.exp < currentTime) {
      return res.status(401).json({ message: 'Token has expired' });
    }

    // Add decoded user data to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
