/**
 * Chat Controller
 * Handles all chat-related operations including:
 * - 1-on-1 chat access/creation
 * - Group chat management (create, rename, add/remove members)
 * - Fetching user's chats
 * - Socket.io integration for real-time updates
 */

const asyncHandler = require("express-async-handler");
const Chat = require("../models/ChatModel");
const User = require("../models/UserModel");

// Store io instance for real-time communication
let io;

/**
 * Set Socket.io instance from server.js
 * Allows controller to emit real-time events
 */
const setIo = (socketIo) => {
  io = socketIo;
};

/**
 * Get Socket.io instance
 */
const getIo = () => io;

/**
 * Access or create 1-on-1 chat
 * POST /api/chat
 * Checks for existing chat between users, creates new if not found
 */
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  
  // Validate userId is provided
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }
  
  // Check if chat already exists between these two users
  var isChat = await Chat.find({
    isGroupChat: false, // Must be a 1-on-1 chat
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } }, // Current user is member
      { users: { $elemMatch: { $eq: userId } } },      // Target user is member
    ],
  })
    .populate("users", "-password") // Populate user details excluding password
    .populate("latestMessage");    // Include latest message
    
  // Populate sender info for latest message
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  // If chat exists, return it; otherwise create new chat
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    // Data for new chat
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId], // Both users in the chat
    };
    try {
      // Create new chat
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password",
      );
      // Notify all connected clients about new chat
      if (io) {
        console.log("Emitting 'chat created' event to all clients");
        io.emit("chat created", FullChat);
      } else {
        console.log("Socket.IO not available, cannot emit chat created event");
      }
      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

/**
 * Fetch all chats for logged-in user
 * GET /api/chat
 * Returns chats sorted by most recent update
 */
const fetchChats = asyncHandler(async (req, res) => {
  try {
    // Find all chats where user is a member
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")      // Populate all members
      .populate("groupAdmin", "-password") // Populate admin for group chats
      .populate("latestMessage")            // Include latest message
      .sort({ updatedAt: -1 })              // Sort by most recent first
      .then(async (results) => {
        // Populate sender details for latest messages
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

/**
 * Create new group chat
 * POST /api/chat/group
 * Requires: name, users (array of user IDs)
 */
const createGroupChat = asyncHandler(async (req, res) => {
  // Validate required fields
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the fields" });
  }

  // Validate chat name length
  if (req.body.name.length > 50) {
    return res
      .status(400)
      .send({ message: "Chat name cannot exceed 50 characters" });
  }
  
  // Parse users array from JSON string
  var users = JSON.parse(req.body.users);
  
  // Require at least 2 other users (plus creator = 3 total minimum)
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }
  
  // Add current user to the group
  users.push(req.user._id);

  // Check for existing group with same name and same members
  const existingChat = await Chat.findOne({
    chatName: req.body.name,
    isGroupChat: true,
    users: { $all: users, $size: users.length },
  });

  if (existingChat) {
    return res.status(400).send({ message: "A group with this name and members already exists" });
  }

  try {
    // Create the group chat
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user, // Creator is admin
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

/**
 * Rename group chat
 * PUT /api/chat/rename
 * Only admin can rename
 */
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  // Validate new name
  if (!chatName) {
    res.status(400);
    throw new Error("Chat name is required");
  }

  if (chatName.length > 50) {
    res.status(400);
    throw new Error("Chat name cannot exceed 50 characters");
  }

  // Update chat name
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName: chatName },
    { new: true },
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

/**
 * Add user to group chat
 * PUT /api/chat/groupadd
 * Only admin can add members
 */
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  
  // Push new user to chat's users array
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    },
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
    
  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    // Notify all users in the group about the update
    if (io) {
      io.emit("chat created", added);
    }
    res.json(added);
  }
});

/**
 * Remove user from group chat
 * PUT /api/chat/groupremove
 * Only admin can remove members (or self-removal)
 * If admin leaves, promotes another member or deletes group if empty
 */
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // Get the chat with full user details
  const chat = await Chat.findById(chatId).populate("users", "-password");

  if (!chat) {
    res.status(404);
    throw new Error("Chat Not Found");
  }

  // Remove the user from users array
  chat.users = chat.users.filter((u) => u._id.toString() !== userId);

  // If the admin is leaving, assign a new admin
  if (chat.groupAdmin.toString() === userId) {
    if (chat.users.length > 0) {
      chat.groupAdmin = chat.users[0]._id; // First remaining member becomes admin
    } else {
      // No users left, delete the group
      await Chat.findByIdAndDelete(chatId);
      return res.status(200).json({ message: "Group deleted, no users left" });
    }
  }

  // Save updated chat
  const updatedChat = await chat.save();
  const fullChat = await Chat.findById(updatedChat._id)
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.json(fullChat);
});

// Export all controller functions and Socket.io setters
module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  setIo,
  getIo,
};
