const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization')
  if(!authHeader) {
    req.isAuth = false
    return next()
  }
  const token = authHeader.split(' ')[1]
  if(!token || token === '') {
    req.isAuth = false
    return next()
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    if(!decoded) {
      req.isAuth = false
      return next()
    }
    req.isAuth = true
    req.userId = decoded.userId
    next()
  } catch(e) {
    req.isAuth = false
    return next()
  }
}
