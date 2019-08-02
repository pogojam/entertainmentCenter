const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const fs = require("fs");

server.listen(5000);

const connections = [];

app.get("/", (res, req) => {
  req.send("Hello");
});

io.on("connect", socket => {
  connections.push(socket);

  socket.on("Upload", ({ name, data }) => {
    console.log(data);

    fs.writeFile("./temp/" + name, data, err => {
      if (err) throw err;
      console.log("upload complete");
    });
  });

  console.log("Connected %s sockets " + connections.length);
});
