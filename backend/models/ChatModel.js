/**
 * Chat Model
 * Defines chat schema for 1-on-1 and group chats
 * Includes: Chat name, type (group/private), members, latest message, admin
 */

const mongoose = require("mongoose");

// Define chat schema
const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true, maxlength: 50 }, // Name for group chats
    isGroupChat: { type: Boolean, default: false }, // True if group, false if 1-on-1
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Chat members
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }, // Most recent message
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Group admin (for group chats)
  },
  { timestamps: true }, // Adds createdAt and updatedAt
);

// Create and export Chat model
const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
