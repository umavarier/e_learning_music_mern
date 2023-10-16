const jwt = require('jsonwebtoken');

const authenticateTeacher = (req, res, next) => {
  console.log("auth!!!")
  const token = req.headers.authorization || req.cookies.token|| req.body.token

  console.log("tokenalpha  " + token);

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, 'secret123');    

    if (decoded.role === 1) {
      req.teacher = decoded; 
      next(); 
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