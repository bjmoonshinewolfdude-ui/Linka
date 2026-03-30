const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./backend/data/data");
const { connect } = require("mongoose");
const connectDB = require("./backend/Config/db");
const colors = require("colors");
const userRoutes = require("./backend/Routes/UserRoutes");
const { notfound, errorHandler } = require("./backend/Middleware/ErrorMiddleware");
const chatRoutes = require("./backend/Routes/chatRoutes");
const messageRoutes = require("./backend/Routes/MessageRoutes");
const path = require("path");

// Railway deployment fix - ensure model paths are correct

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); // to accept json data

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
// -------------------------Deployment Code ----------------------------------
const __dirname1 = path.resolve();
const fs = require('fs');

if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname1, "/frontend/build");
  
  // Check if build folder exists
  if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath));

    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
    });
  } else {
    app.get("/", (req, res) => {
      res.send("API is running.. (Build folder not found)");
    });
  }
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}
// ---------------------------------------------------------------------------

app.use(notfound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server is running on port ${PORT}`.yellow.bold),
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
});

global.onlineUsers = new Map();

const addUserToOnlineList = (userId, socketId) => {
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, socketId);
  }
};

const removeUserFromOnlineList = (socketId) => {
  if (socketId && onlineUsers.has(socketId)) {
    const userId = onlineUsers.get(socketId);
    onlineUsers.delete(socketId);
    return userId;
  }
};

const getUser = (userId) => {
  return onlineUsers.get(userId);
};

io.on("setup", (userData) => {
  const { userId, socketId } = userData;
  addUserToOnlineList(userId, socketId);
  socket.emit("connected");
});

io.on("join chat", (userId) => {
  const users = getUser(userId);
  socket.join(userId);
});

io.on("new message", (newMessageRecieved) => {
  const chat = newMessageRecieved.chat;

  if (!chat.users) return;

  chat.users.forEach((user) => {
    if (user._id == newMessageRecieved.sender._id) return;

    socket.in(user._id).emit("message recieved", newMessageRecieved);
  });
});

io.on("typing", ({ userId, chatId }) => {
  const user = getUser(userId);
  if (user) {
    socket.in(chatId).emit("typing", user);
  }
});

io.on("stop typing", ({ userId, chatId }) => {
  const user = getUser(userId);
  if (user) {
    socket.in(chatId).emit("stop typing", user);
  }
});

io.on("disconnect", () => {
  removeUserFromOnlineList(socket.id);
  socket.emit("disconnect");
});

socket.off("setup", () => {
  socket.disconnect();
});
