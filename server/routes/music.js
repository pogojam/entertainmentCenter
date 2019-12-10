const express = require("express");
const fs = require("fs");
const { spawn, execFile } = require("child_process");
const path = require("path");
const axio = require("axios");
const musicRoutes = express.Router();

const scripts = {
  recording: path.basename("../workers/setupRecording.sh")
};

const musicSockets = (socket, stream, database) => {
  stream.emit("startCapture", (stream, data) => {
    // const displays = execFile("../workers/setupRecording.sh", ["dev"], {
    //   deatached: true
    // });
    // displays.stdout.on("data", data => {
    //   console.log(data.toString());
    // });

    const child = spawn(`ffmpeg`, [
      "-f",
      "avfoundation",
      "-i",
      "1|1",
      "output.mkv"
    ]);

    child.on("exit", code => {
      console.log(`Child process exited with code ${code}`);
    });
    child.stdout.on("data", data => {
      const recording = path.basename(`../output.mkv`);
      const screenCapture = fs.createReadStream(recording);
      screenCapture.pipe(stream);
    });
    child.stderr.on("data", data => {
      console.log(`stderr: ${data}`);
    });
  });
};

musicRoutes.get("/", (req, res) => {
  console.log(req);
});

module.exports = { musicRoutes, musicSockets };
