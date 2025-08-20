const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Prisma-specific errors
  if (err.code === 'P2025') {
    return res.status(404).json({ message: 'Resource not found.' });
  }

  // General error handling
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};

module.exports = errorHandler;
