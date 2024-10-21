const jwt = require("jsonwebtoken");

const signToken = (payload) => {
  return jwt.sign(payload, "showstopper");
};

const verifyToken = (token) => {
  return jwt.verify(token, "showstopper");
};

module.exports = { signToken, verifyToken };
