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

  res.status(status).json(payload);
};
