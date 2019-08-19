const express = require("express");
const ss = require("socket.io-stream");
const fs = require("fs");
const axio = require("axios");
const musicRoutes = express.Router();

const musicSockets = (socket, database) => {
  ss(socket).on("Play", (stream, data) => {
    console.log(stream);
    fs.createReadStream("./temp/music/land.mp3").pipe(stream);
  });
};

musicRoutes.get("/", (req, res) => {
  console.log(req);
});

module.exports = { musicRoutes, musicSockets };
