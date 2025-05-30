const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
  generateToken: (payload) => {
    let token = jwt.sign(payload, process.env.JWT_SECRET)
    return token
  },
  verifyToken: (token) => {
    return jwt.verify(token,  process.env.JWT_SECRET)
  }
}