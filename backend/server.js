const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const { connect } = require("mongoose");
const connectDB = require("./Config/db");
const colors = require("colors");
const userRoutes = require("./Routes/UserRoutes");
const { notfound, errorHandler } = require("./Middleware/ErrorMiddleware");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/MessageRoutes");
const path = require("path");

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

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
