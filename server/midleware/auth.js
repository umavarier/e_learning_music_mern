const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization'); // Assuming you send the JWT token in the Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, 'secret123', (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    // Attach the decoded token (user information) to the request for later use
    req.user = decodedToken;
    next(); // Continue to the next middleware or route handler
  });
};

module.exports = {
  auth,
};

