const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes - verifies JWT and attaches user to req.user
const protect = async (req, res, next) => {
  let token;

  // Token is expected in the format: "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      token = authHeader.split(" ")[1];

      // Verify token signature and expiry
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request, excluding password
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

module.exports = { protect };