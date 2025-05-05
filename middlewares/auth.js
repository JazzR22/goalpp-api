const { verifyToken } = require('../utils/jwt');
const ErrorFactory = require('../utils/ErrorFactory');

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw ErrorFactory.invalidToken();
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return next(err)
  }
};
