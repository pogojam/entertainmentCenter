const express = require("express");
const fs = require("fs");
const p = require("path");
const videoRoutes = express.Router();
const ss = require("socket.io-stream");
const axio = require("axios");

const omdbPath = `http://www.omdbapi.com/?apikey=${process.env.OMBD}&`;

// Stream Video

videoRoutes.get("/", function (req, res) {
  console.log(req.body, res);
  const moviePath = req.query.path;
  console.log(moviePath);
  const path = p.join(__dirname, "..", "movies", moviePath);
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
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    const videoStream = fs.createReadStream(path);
    console.log(videoStream);
    videoStream.pipe(res);
  }
});

const Files = {};

const videoSockets = (socket, stream, database) => {
  const movieFolder = p.join(__dirname, "..", "/movies/");
  const setupMovieMetaData = async (name) => {
    const nameElements = name.split(".");
    const metaData = await getMovieData(nameElements[0]);
    //Will not upload movie if it's not found on the IMBd database
    if (metaData === "Movie not found!") return console.log("Movie not found");

    const { title } = metaData;
    const movieCollection = database
      .collection("movies")
      .doc(title || nameElements[0]);
    const dataTemplate = {
      RawName: nameElements[0],
      FileExtension: nameElements[1],
      Path: name,
    };
    typeof metaData === "object" && Object.assign(dataTemplate, metaData);
    movieCollection.set(dataTemplate);
  };

  socket.on("Upload", ({ name, data }) => {
    Files[name].Downloaded += data.length;
    console.log(typeof data);

    Files[name].Data = Buffer.concat(Files[name].Data, data);
    console.log(data.length);
    console.log(Files[name]["Downloaded"] == Files[name]["FileSize"]);
    console.log(Files[name].Downloaded, Files[name].FileSize);
    if (Files[name]["Downloaded"] == Files[name]["FileSize"]) {
      //If File is Fully Uploaded
      console.log("DOWNLOAD FINISHED");
      fs.appendFile(
        Files[name]["Handler"],
        Buffer.from(Files[name]["Data"]),
        function (err, Writen) {
          //Get Thumbnail Here
          console.log("Write Complete");
        }
      );
      return;
    } else if (Files[name]["Data"].length > 10485760) {
      console.log("BUFFER RESET");
      console.log(Files[name].Handler);

      //If the Data Buffer reaches 10MB
      fs.appendFile(
        Files[name].Handler,
        Buffer.from(Files[name].Data),
        function (err, write) {
          Files[name].Data = ""; //Reset The Buffer
          var place = Files[name].Downloaded / 524288;
          var percent =
            (Files[name]["Downloaded"] / Files[name]["FileSize"]) * 100;
          socket.emit("MoreData", { place, name, percent });
        }
      );
    } else {
      var place = Files[name]["Downloaded"] / 524288;
      var percent = (Files[name]["Downloaded"] / Files[name]["FileSize"]) * 100;
      socket.emit("MoreData", { place, name, percent });
    }
  });

  socket.on("Start", ({ name, size }) => {
    console.log(movieFolder + name);
    Files[name] = {
      //Create a new Entry in The Files Variable
      Handler: movieFolder + name,
      FileSize: size,
      Data: [],
      Downloaded: 0,
    };
    let place = 0;

    if (fs.existsSync("./movies/" + name)) {
      console.log("File Exists");
      const stat = fs.statSync("./movies/" + name);
      Files[name].Downloaded = stat.size;
      place = stat.size / 524288;

      socket.emit("MoreData", { place, name });
    } else {
      console.log("Setting up new file " + name);
      fs.open("movies/" + name, "a", 0755, function (err, fd) {
        if (err) {
          console.log(err);
        } else {
          console.log(fd);
          setupMovieMetaData(name);
          Files[name].Handler = fd; //We store the file handler so we can write to it later
          socket.emit("MoreData", { place, name });
          // socket.emit("MoreData", { place: place, Percent: 0 });
        }
      });
    }
  });

  stream.on("streamVideo", (stream, { path }) => {
    console.log(stream, "data", data, path);
    stream.pipe(fs.createReadStream(path));
  });
};

const getMovieData = async (title) => {
  const { data } = await axio.get(omdbPath + "t=" + title);
  if (data.Error) return data.Error;
  return data;
};

module.exports = { videoRoutes, videoSockets };
