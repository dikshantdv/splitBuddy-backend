const socket = require("socket.io");

const io = new socket.Server(9000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

module.exports = io;
