const express = require("express");
const fs = require("fs");
const p = require("path");
const videoRoutes = express.Router();
const ss = require("socket.io-stream");
const axio = require("axios");

const omdbPath = `http://www.omdbapi.com/?apikey=${process.env.OMBD}&`;

// Stream Video

videoRoutes.get("/", function(req, res) {
  console.log(req.body, res);
  const path = p.basename("../output.mkv");
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4"
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4"
    };
    res.writeHead(200, head);
    const videoStream = fs.createReadStream(path);
    console.log(videoStream);
    videoStream.pipe(res);
  }
});

const videoSockets = (socket, stream, database) => {
  socket.on("Upload", ({ name, data }) => {
    fs.writeFile("./temp/" + name, data, async err => {
      if (err) throw err;
      const nameElements = name.split(".");
      const metaData = await getMovieData(nameElements[0]);
      const { title } = metaData;
      const movieCollection = database
        .collection("movies")
        .doc(title || nameElements[0]);
      const dataTemplate = {
        RawName: nameElements[0],
        FileExtension: nameElements[1],
        Path: name
      };

      console.log(typeof metaData === "object");

      typeof metaData === "object" && Object.assign(dataTemplate, metaData);

      movieCollection.set(dataTemplate);

      console.log("upload complete");
    });
  });

  stream.on("streamVideo", (stream, { path }) => {
    console.log(stream, "data", data, path);
    stream.pipe(fs.createReadStream(path));
  });
};

const getMovieData = async title => {
  const { data } = await axio.get(omdbPath + "t=" + title);
  if (data.Error) return data.Error;
  return data;
};

module.exports = { videoRoutes, videoSockets };
