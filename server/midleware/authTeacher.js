const jwt = require('jsonwebtoken');

const authenticateTeacher = (req, res, next) => {
  const accessToken = req.headers.authorization || req.cookies.token;
  
  if (!accessToken) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  console.log("auth----"+accessToken)
  
  try {
    const decoded = jwt.verify(accessToken, 'secret123');
    req.teacher = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, 'refreshSecret123');
    const newAccessToken = jwt.sign(
      { id: decoded.id, userName: decoded.userName, role: decoded.role },
      'secret123',
      {
        expiresIn: '1d',
      }
    );

    // Send the new access token in the response
    res.status(200).json({ token: newAccessToken });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

module.exports = {
  authenticateTeacher,
  refreshToken,
};
