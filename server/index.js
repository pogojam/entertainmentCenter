require("./services/jobs");
require("./services/aws/config");
const app = require("express")();
const apolloServer = require("./services/apollo");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const ss = require("socket.io-stream");
const { searchRouter } = require("./routes/search");
const { videoRoutes, videoSockets } = require("./routes/video");
const { musicRoutes, musicSockets } = require("./routes/music");
const { storageSockets } = require("./routes/storage");
const { database } = require("./services/firebase");
const { apolloUploadExpress } = require("apollo-upload-server");

const connections = [];
const port = 5000;

app.use(apolloUploadExpress());
app.use("/video", videoRoutes);
app.use("/music", musicRoutes);

app.use("/search", searchRouter);
apolloServer.applyMiddleware({ app });

io.on("connect", (socket) => {
  const stream = ss(socket);
  connections.push(socket.id);
  videoSockets(socket, stream, database);
  musicSockets(socket, stream, database);
  storageSockets(socket);
  console.log("Connected sockets " + connections.length, connections);
});

server.listen(port, () => console.log("server up on port " + port));
