const app = require("express")();
const apolloServer = require("./services/apollo");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { videoRoutes, videoSockets } = require("./routes/video");
const { musicRoutes, musicSockets } = require("./routes/music");
const { database } = require("./services/firebase");

const connections = [];
const port = 5000;

apolloServer.applyMiddleware({ app });
app.use("/video", videoRoutes);
app.use("/music", musicRoutes);

io.on("connect", socket => {
  connections.push(socket.id);
  videoSockets(socket, database);
  musicSockets(socket, database);
  console.log("Connected sockets " + connections.length);
});

server.listen(port, () => console.log("server up on port " + port));
