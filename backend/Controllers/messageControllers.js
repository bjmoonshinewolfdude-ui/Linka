const asyncHandler = require("express-async-handler");
const Message = require("../models/MessageModel");
const User = require("../models/UserModel");
const Chat = require("../models/ChatModel");

console.log("Controller directory:", __dirname);

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  // Verify user is part of the chat
  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }
  
  const isUserInChat = chat.users.some((u) => u.toString() === req.user._id.toString());
  if (!isUserInChat) {
    return res.status(403).json({ message: "You are not a member of this chat" });
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);
    
    // Run populate operations in parallel
    const [populatedMessage] = await Promise.all([
      Message.findById(message._id)
        .populate("sender", "name pic")
        .populate("chat")
        .populate("chat.users", "name pic email"),
      Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message })
    ]);
    
    res.json(populatedMessage);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    // Verify user is part of the chat before returning messages
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    
    const isUserInChat = chat.users.some((u) => u.toString() === req.user._id.toString());
    if (!isUserInChat) {
      return res.status(403).json({ message: "You are not a member of this chat" });
    }
    
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };
