import React, { useEffect, useState } from "react";
// import Player from "../components/player/spotify";
import io from "socket.io-client";
import ss from "socket.io-stream";
import { Box, Heading } from "rebass";

const socket = io(window.location.hostname + ":5000");

// stream.on("data", (stream) => {
//   console.log(stream);
// });

const handleStream = (cb) => {
  console.log("object");
  ss(socket).on("streamVideo", (stream, data) => {
    cb(stream);
  });
};

export default function Music() {
  const [videoStream, setStream] = useState();

  return (
    <Box>
      <Heading>Screen capture</Heading>
      <button
        onClick={() =>
          handleStream((st) => {
            console.log(st);
          })
        }
      >
        Start stream
      </button>
      <Box
        as="video"
        style={{ height: "100%", overflowY: "scroll" }}
        width={[1]}
        src={videoStream}
      />
    </Box>
  );
}
