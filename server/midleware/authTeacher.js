const jwt = require('jsonwebtoken');

// Middleware for authentication
const authenticateTeacher = (req, res, next) => {
  // Get the token from the request headers, cookies, or wherever you store it
  const token = req.headers.authorization || req.cookies.token|| req.body.token

  console.log("tokenalpha" + token);

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, 'secret123');
    console.log("decoded   ::;"+ decoded.id)

    // Check if the decoded user role is 'teacher'
    if (decoded.role === 1) {
      req.teacher = decoded; // Attach the teacher information to the request
      next(); // Continue to the route handler
    } else {
      return res.status(403).json({ message: 'Forbidden' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};


module.exports ={
    authenticateTeacher,
};