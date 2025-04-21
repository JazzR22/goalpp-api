const { verifyToken } = require('../utils/jwt')
const ErrorFactory = require('../utils/ErrorFactory')

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization')
  const cookieToken = req.cookies.token

  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.replace('Bearer ', '')
    : cookieToken

  if (!token) {
    throw ErrorFactory.invalidToken()
  }

  try {
    console.log('🛡 Authorization header:', req.headers.authorization);
    const decoded = verifyToken(token)
    req.user = decoded.id
    next()
  } catch (err) {
    throw ErrorFactory.invalidToken()
  }
}