const logger = require("../utils/logger");

/**
 * Global error handler middleware
 */
function errorHandler(err, req, res, next) {
  // Log the error
  logger.error({
    err,
    url: req.url,
    method: req.method,
    ip: req.ip
  }, "Request error");

  // Don't leak error details in production
  const isDev = process.env.NODE_ENV !== "production";
  
  const statusCode = err.statusCode || err.status || 500;
  const message = isDev ? err.message : "Internal server error";
  
  res.status(statusCode).json({
    error: message,
    ...(isDev && { stack: err.stack })
  });
}

/**
 * 404 handler
 */
function notFoundHandler(req, res) {
  res.status(404).json({ error: "Not found" });
}

/**
 * Async route wrapper to catch errors
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler
};
