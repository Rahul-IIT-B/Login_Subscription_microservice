// middleware/errorHandler.js

module.exports = (err, req, res, next) => {
  console.error(err);

  // If the error was thrown with a custom status, use it; otherwise default to 500
  const status = err.status || 500;

  // Standardize our error response payload
  const payload = {
    success: false,
    message: err.message || 'Internal Server Error',
  };

  // Optionally include additional info in development mode
  if (process.env.NODE_ENV === 'development' && err.stack) {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
};
