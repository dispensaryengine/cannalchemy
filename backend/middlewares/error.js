
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Sequelize Validation Error
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_INPUT', message: errors.join(', ') },
    });
  }
  
  // Sequelize Database Error
  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Database error' },
    });
  }
  
  // JWT Error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Invalid token' },
    });
  }
  
  // Default Error
  res.status(500).json({
    success: false,
    error: { code: 'SERVER_ERROR', message: 'Internal server error' },
  });
};

module.exports = errorHandler;
