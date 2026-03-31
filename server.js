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
const { setIo } = require("./backend/Controllers/chatControllers");

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

// Pass io instance to chat controllers
setIo(io);

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
  console.log("New socket connection:", socket.id);

  socket.on("setup", (userData) => {
    try {
      // Handle both formats: { userId: "..." } or { _id: "..." }
      const userId = userData?.userId || userData?._id;
      if (!userId) {
        console.log("No userId provided in setup");
        return;
      }
      console.log("Socket setup for user:", userId);
      addUserToOnlineList(userId.toString(), socket.id);
      socket.emit("connected");
    } catch (error) {
      console.error("Error in socket setup:", error);
    }
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room:", room);
  });

  socket.on("leave chat", (room) => {
    socket.leave(room);
    console.log("User left room:", room);
  });

  socket.on("new message", (newMessageRecieved) => {
    try {
      const chat = newMessageRecieved.chat;

      if (!chat || !chat.users) {
        console.log("No chat or chat.users in message");
        return;
      }

      console.log("New message received:", newMessageRecieved);
      // Emit to all users in the chat individually (not just those in the room)
      // so notifications work even when user is in a different chat
      chat.users.forEach((user) => {
        if (!user || !user._id) return;
        const userIdStr = typeof user._id === 'string' ? user._id : user._id.toString?.() || String(user._id);
        const userSocketId = onlineUsers.get(userIdStr);
        console.log(`Looking for socket for user ${userIdStr}: ${userSocketId}`);
        if (userSocketId && userSocketId !== socket.id) {
          io.to(userSocketId).emit("message recieved", newMessageRecieved);
          console.log(`Emitted message to user ${userIdStr} at socket ${userSocketId}`);
        }
      });
    } catch (error) {
      console.error("Error in new message handler:", error);
    }
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing", room);
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing", room);
  });

  socket.on("disconnect", () => {
    removeUserFromOnlineList(socket.id);
    console.log("User disconnected");
  });
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
