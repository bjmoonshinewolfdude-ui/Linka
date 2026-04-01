/**
 * User Routes
 * Defines API endpoints for user operations
 * Routes: Registration, login, user search
 */

const express = require("express");
const router = express.Router();

// Import controller functions
const { registerUser, authUser, allUsers } = require("../Controllers/userControllers");

// Import authentication middleware
const { protect } = require("../Middleware/authMiddleware");

// Define routes
router.route("/").post(registerUser);  // POST /api/user - Register new user
router.post("/login", authUser);     // POST /api/user/login - Authenticate user
router.route("/").get(protect, allUsers); // GET /api/user - Get all users (protected)

// Export router for use in server.js
module.exports = router;
