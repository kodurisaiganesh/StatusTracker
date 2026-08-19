// 404 — route not found
export function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

// Global error handler — catches any error passed to next(error)
export function errorHandler(err, req, res, next) {
  console.error(err.message);

  // Duplicate key 
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: "This email is already registered" });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: statusCode >= 500 ? "Something went wrong on the server" : err.message
  });
}