// Handles requests to routes that do not exist
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error); // forward to errorHandler
};

// Centralized error handler - catches all errors passed via next(error)
const errorHandler = (err, req, res, next) => {
  // If status code wasn't already set (e.g. by notFound), default to 500
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    // Only include stack trace in development for debugging
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };