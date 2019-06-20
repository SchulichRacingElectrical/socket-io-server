const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

//Port from environment variable or default - 4001
const port = process.env.PORT || 4001;

//Redis Setup
const redis = require('redis');
const subscriber = redis.createClient();
subscriber.subscribe("design");
//Setting up express and adding socketIo middleware
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let interval;
io.on("connection", socket => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 100);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

const getApiAndEmit = async socket => {
    subscriber.on("message", function (channel, message) {
        socket.emit("FromAPI", "data recieved")
        console.log(message);
        //socket.emit("FromAPI", JSON.parse(message)); // Emitting a new message. It will be consumed by the client
        });
  };