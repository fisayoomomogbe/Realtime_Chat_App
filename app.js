const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Middlewares
app.use(express.static(path.join(__dirname, "public")));

const adminName = "ChatTime Admin";

// Run when a client connects
io.on("connection", (socket) => {
  //   Welcome current user
  socket.emit("message", formatMessage(adminName, "Welcome to ChatTime!"));

  //   broadcast when a user connects
  socket.broadcast.emit(
    "message",
    formatMessage(adminName, "A user has joined the chat")
  );

  // Runs when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(adminName, " A user has left the chat"));
  });
  //  Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    io.emit("message", formatMessage("USER", msg));
  });
});

server.listen("4000", () => {
  console.log("Server is running on port 4000");
});
