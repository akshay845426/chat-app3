const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = [];

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinChat", (username) => {
    users.push({ id: socket.id, username });
    io.emit("updateUsers", users.map(user => user.username));
  });

  socket.on("chatMessage", (message) => {
    io.emit("chatMessage", { username: users.find(user => user.id === socket.id).username, message });
  });

  socket.on("privateMessage", (data) => {
    const recipientSocket = users.find(user => user.username === data.recipient)?.id;
    if (recipientSocket) {
      io.to(recipientSocket).emit("privateMessage", { username: users.find(user => user.id === socket.id).username, message: data.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    users = users.filter(user => user.id !== socket.id);
    io.emit("updateUsers", users.map(user => user.username));
  });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
