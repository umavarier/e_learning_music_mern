const jwt = require('jsonwebtoken');

// Middleware function to verify the JWT token
const verifyToken = (req, res, next) => {
  // Get the token from the request headers
  const token = req.header('Authorization');
  console.log("token   :::"+req.body)

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'secret123');
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ error: 'Invalid token.' });
  }

};

module.exports = {
    verifyToken
}