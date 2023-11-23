const jwt = require('jsonwebtoken');

const authenticateAdmin = (req, res, next) => {
  const accessToken = req.headers.authorization || req.cookies.token||req.body.token
  console.log("authAdmin----"+accessToken)
  
  if (!accessToken) {
    return res.status(401).json({ message: 'Authentication required' });
  } 
  
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    // console.log(JSON.stringify(decoded))
    req.admin = decoded;
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
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH);
    const newAccessToken = jwt.sign(
      { id: decoded._id, userName: decoded.username, role: decoded.role },
      process.env.JWT_SECRET,
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
  authenticateAdmin,
  refreshToken,
};
