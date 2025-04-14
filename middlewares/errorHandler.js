module.exports = function errorHandler(err, req, res, next) {
    console.error('ERROR:', err)
  
    const status = err.status || 500
    const errorCode = err.code || 'INTERNAL_ERROR'
    const message = err.message || 'Internal server error'
  
    res.status(status).json({
      error: errorCode,
      message
    })
  }