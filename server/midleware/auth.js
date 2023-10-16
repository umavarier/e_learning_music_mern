const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers.authorization || req.cookies.token|| req.body.token 

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, 'secret123', (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
       req.user = decodedToken;     
    next(); 
  });
};

module.exports = {
  auth,
};

