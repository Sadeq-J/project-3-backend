// middleware/verify-token.js

// We'll need to import jwt to use the verify method
const jwt = require('jsonwebtoken');
const User = require('../models/User')

async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ err: 'No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id || decoded.id);
    
    if (!user) {
      return res.status(401).json({ err: 'User not found.' });
    }

    req.user = user;

    next();
  } catch (err) {
    res.status(401).json({ err: 'Invalid token.' });
  }
}

// We'll need to export this function to use it in our controller files
module.exports = verifyToken;
