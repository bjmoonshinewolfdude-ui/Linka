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
// Last updated: 2025-03-30 21:36 UTC

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

    app.get(/.*/, (req, res) => {
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

const PORT = process.env.PORT || 5001;

const server = app.listen(
  PORT,
  console.log(`Server is running on port ${PORT}`.yellow.bold),
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.NODE_ENV === "production" ? "*" : "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

global.onlineUsers = new Map();

const addUserToOnlineList = (userId, socketId) => {
  onlineUsers.set(userId, socketId);
};

const removeUserFromOnlineList = (socketId) => {
  for (const [userId, id] of onlineUsers.entries()) {
    if (id === socketId) {
      onlineUsers.delete(userId);
      return userId;
    }
  }
};

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    const { userId } = userData;
    addUserToOnlineList(userId, socket.id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room: " + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    const chat = newMessageRecieved.chat;

    if (!chat.users) return;

    // Emit to the chat room so all participants in that chat receive it
    socket.to(chat._id).emit("message recieved", newMessageRecieved);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("disconnect", () => {
    removeUserFromOnlineList(socket.id);
    console.log("User disconnected");
  });
});
