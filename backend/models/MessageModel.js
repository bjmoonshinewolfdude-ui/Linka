/**
 * Message Model
 * Defines message schema for chat messages
 * Includes: Sender reference, message content, chat reference
 */

const mongoose = require("mongoose");

// Define message schema
const messageModel = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Message sender
    content: { type: String, trim: true }, // Message text content
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" }, // Parent chat
  },
  { timestamps: true }, // Adds createdAt and updatedAt
);

// Create and export Message model
const Message = mongoose.model("Message", messageModel);

module.exports = Message;
