/**
 * Chat Routes
 * Defines API endpoints for chat operations
 * Routes: 1-on-1 chats, group chats, member management
 */

const express = require("express");
const router = express.Router();

// Import controller functions
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../Controllers/chatControllers");

// Import authentication middleware
const { protect } = require("../Middleware/authMiddleware");

// Define routes
router.route("/").post(protect, accessChat);    // POST /api/chat - Access/create 1-on-1 chat
router.route("/").get(protect, fetchChats);     // GET /api/chat - Get all user's chats

router.route("/group").post(protect, createGroupChat);  // POST /api/chat/group - Create group
router.route("/rename").put(protect, renameGroup);      // PUT /api/chat/rename - Rename group
router.route("/groupadd").put(protect, addToGroup);     // PUT /api/chat/groupadd - Add member
router.route("/groupremove").put(protect, removeFromGroup); // PUT /api/chat/groupremove - Remove member

// Export router for use in server.js
module.exports = router;
