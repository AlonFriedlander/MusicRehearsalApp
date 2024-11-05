import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization'); // Correct variable name
  console.log("Authorization Header:", authHeader); // Log the Authorization header

  // Check if the token is present
  const token = authHeader?.split(' ')[1];
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user info to request object
    console.log("Token is valid, user:", req.user); // Log the decoded token data
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.log("Invalid token:", error.message); // Log the error if token verification fails
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;
