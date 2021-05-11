const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser } = require("./utils/users");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Middlewares
app.use(express.static(path.join(__dirname, "public")));

const adminName = "ChatTime Admin";

// Run when a client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    //   Welcome current user
    socket.emit("message", formatMessage(adminName, "Welcome to ChatTime!"));

    //   broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(adminName, `${user.username} has joined the chat`)
      );
  });

  //  Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(adminName, " A user has left the chat"));
  });
});

server.listen("4000", () => {
  console.log("Server is running on port 4000");
});
