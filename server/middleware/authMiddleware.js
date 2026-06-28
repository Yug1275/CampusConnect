const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes - verifies JWT and attaches user to req.user
const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, user no longer exists");
      }

      return next();
    } catch (error) {
      res.status(401);
      return next(new Error("Not authorized, token failed"));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error("Not authorized, no token"));
  }
};

// Middleware to restrict access based on user role
// Usage: authorize("admin") or authorize("admin", "faculty")
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      return next(new Error("Not authorized, no user found on request"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403);
      return next(
        new Error(`Access denied. Role '${req.user.role}' is not permitted to access this resource`)
      );
    }

    next();
  };
};

module.exports = { protect, authorize };