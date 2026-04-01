/**
 * Authentication Middleware
 * Validates JWT tokens and user authorization
 * Includes: JWT verification, role-based access control
 */

// Import required dependencies
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const expressAsyncHandler = require("express-async-handler");

/**
 * JWT Authentication Middleware
 * Verifies Bearer token and attaches user to request
 * Used on protected routes
 */
const protect = expressAsyncHandler(async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from header (format: "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];
      
      // Verify token using JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user and attach to request (excluding password field)
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  // No token provided
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

/**
 * Admin Authorization Middleware
 * Checks if authenticated user has admin role
 * Must be used after protect middleware
 */
const admin = expressAsyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as admin");
  }
});

// Export middleware functions
module.exports = { protect, admin };
