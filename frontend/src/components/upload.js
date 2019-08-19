import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Flex, Button, Box } from "rebass";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const uploadEvent = data => {
  const loadFile = file => {
    const fReader = new FileReader();

    fReader.onload = event => {
      console.log(event.target.result);
      socket.emit("Upload", { name: file.name, data: event.target.result });
    };
    console.log(file);
    fReader.readAsArrayBuffer(file);
    socket.emit("Start", { name: file.name, Size: file.size });
  };

  for (let i = 0; i < data.length; ++i) {
    loadFile(data[i]);
  }
};

export const Upload = ({ toggle }) => {
  const [fileData, setFile] = useState(null);

  useEffect(() => {}, []);
  console.log(fileData);
  return (
    <Flex
      style={{ height: "100vh", position: "absolute", top: "0" }}
      bg="#a9a9a98a"
      width="100%"
      alignItems="center"
      justifyContent="center"
      onClick={e => toggle(false)}
    >
      <Box
        style={{
          borderRadius: "6px",
          padding: "8em",
          backgroundColor: "whitesmoke"
        }}
        onClick={e => e.stopPropagation()}
      >
        <input
          type="file"
          accept="video/*"
          multiple
          onChange={e => setFile(e.target.files)}
        />
        {fileData && (
          <Button onClick={() => uploadEvent(fileData) & toggle(false)}>
            Upload
          </Button>
        )}
      </Box>
    </Flex>
  );
};

export const VideoPlayer = () => {
  const Video = styled.video`
    position: absolute;
    top: 0;
    left: 0;
    max-height: 100vh;
    max-width: 100vw;
  `;

  return (
    <Video controls>
      <source src="http://localhost:5000/video" type="video/mp4" />;
    </Video>
  );
};
