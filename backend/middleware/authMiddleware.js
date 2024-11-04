import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // Get token from the request headers
  const token = req.header('Authorization')?.split(' ')[1];

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user info to the request object
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;
