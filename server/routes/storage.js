const ss = require("socket.io-stream");
const Path = require("path");
const fs = require("fs");

const makeFile = (path, data) => {
  fs.writeFile(path, data, e => {
    console.log("upload done", e);
  });
};

const storageSockets = (socket, database) => {
  const fileArr = [];

  socket.on("fileUpload", async fileData => {
    let { data, size, path, name } = fileData;
    const basePath = Path.basename(path);
    const isFile = await fs.existsSync(basePath + name);

    fileArr.push(data);
    if (isFile) {
      console.log(basePath);
      const fileStats = await fs.fstatSync(basePath + name).size;
      const isComplete = size === fileStats.size;
      console.log("file made", fileStats.size);
      console.log(size, fileStats);
      if (!isComplete) {
        await makeFile(basePath + name, fileArr);
        return;
      }
    }

    socket.emit("requestSlice", {
      currentSlice: fileData.currentSlice
    });
  });

  //   ss(socket).on("Play", (stream, data) => {
  //     console.log(stream);
  //     fs.createReadStream("./temp/music/land.mp3").pipe(stream);
  //   });
};

module.exports = { storageSockets };
