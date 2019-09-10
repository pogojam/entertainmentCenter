const ss = require("socket.io-stream");
const Path = require("path");
const fs = require("fs");
const basePath = Path.basename("../storage/");

const storageSockets = socket => {
  socket.on("addFolder", data => {
    console.log(data);
  });

  socket.on("fileUpload", (stream, { dir, name }) => {
    const path = basePath + dir + name;
    const writeStream = fs.createWriteStream(path);
    stream.pipe(writeStream);

    writeStream.on("finish", e => {
      const isFile = fs.existsSync(path);
      console.log(isFile);
      socket.emit("uploadEnd", { e });
    });
  });
};

module.exports = { storageSockets };
