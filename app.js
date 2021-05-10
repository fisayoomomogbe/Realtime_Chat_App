const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Middlewares
app.use(express.static(path.join(__dirname, "public")));

// Run when a client connects
io.on("connection", (socket) => {
  console.log("New WS Connection...");
});

server.listen("4000", () => {
  console.log("Server is running on port 4000");
});
