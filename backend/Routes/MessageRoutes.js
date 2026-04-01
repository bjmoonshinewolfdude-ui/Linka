/**
 * Message Routes
 * Defines API endpoints for message operations
 * Routes: Send message, fetch chat messages
 */

const express = require("express");
const router = express.Router();

// Import controller functions
const { sendMessage } = require("../Controllers/messageControllers");
const { allMessages } = require("../Controllers/messageControllers");

// Import authentication middleware
const { protect } = require("../Middleware/authMiddleware");

// Define routes
router.route("/").post(protect, sendMessage);       // POST /api/message - Send message
router.route("/:chatId").get(protect, allMessages); // GET /api/message/:chatId - Get messages

// Export router for use in server.js
module.exports = router;
