import React, { useEffect, useState } from "react";
import Player from "../components/player/spotify";
import io from "socket.io-client";
import ss from "socket.io-stream";

const socket = io("http://localhost:5000");
const stream = ss.createStream();

export default function Music() {
  const [player, togglePlayer] = useState(false);
  const [src, setSrc] = useState(false);
  // const audioContext = new AudioContext();
  const parts = [];

  const handleClick = e => {
    ss(socket).emit("Play", stream);

    stream.on("data", data => {
      console.log(data);
      parts.push(data);
    });
    stream.on("end", () => {
      setSrc(
        window.URL.createObjectURL(new Blob([new Uint8Array(parts).buffer]))
      );
      togglePlayer(true);
    });

    // const audioStream = new MediaStream();
    // console.log(audioStream);
    // const audio = audioContext.createMediaStreamSource(stream);
    // audio.connect(audioContext.destination);
    // audio.start();
  };
  return (
    <div>
      {player && (
        <audio controls autoPlay>
          <source src={src} type="audio/mp3" />
        </audio>
      )}
      <button onClick={handleClick}>Sync Song</button>
      <Player />
    </div>
  );
}
