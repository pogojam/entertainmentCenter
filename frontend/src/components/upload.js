import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { Flex, Button, Box } from "rebass";
import { TiArrowLeftThick } from "react-icons/ti";
import io from "socket.io-client";
import ss from "socket.io-stream";
import fileReaderStream from "filereader-stream";

const socket = io("http://localhost:5000");

const uploadEvent = data => {
  const loadFile = file => {
    const fReader = new FileReader();

    fReader.onload = event => {
      socket.emit("Upload", { name: file.name, data: event.target.result });
    };
    fReader.readAsArrayBuffer(file);
    socket.emit("Start", { name: file.name, Size: file.size });
  };

  for (let i = 0; i < data.length; ++i) {
    loadFile(data[i]);
  }
};

export const uploadFile = async (file, dir, refetch) => {
  const Stream = ss.createStream();
  const fileInfo = {
    name: file.name,
    dir: dir,
    size: file.size
  };

  socket.on("uploadEnd", e => {
    refetch();
  });
  ss(socket).emit("fileUpload", Stream, fileInfo);
  fileReaderStream(file).pipe(Stream);
};

export const Upload = ({ toggle }) => {
  const [fileData, setFile] = useState(null);

  console.log(fileData);
  return (
    <Flex
      style={{ height: "100vh", position: "absolute", top: "0", zIndex: 999 }}
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

export const VideoPlayer = ({ fullScreen, exit }) => {
  const handleMove = () => {};

  const fullsceenStyle = css`
    width: 100%;
    height: 100%;
    z-index: 2;
  `;

  const Video = styled.video`
    background-color: black;
    position: absolute;
    top: 0;
    left: 0;
    max-height: 100vh;
    max-width: 100vw;

    ${fullScreen && fullsceenStyle}
  `;

  return (
    <Box onMouseMove={handleMove}>
      <TiArrowLeftThick
        color="white"
        size="45"
        style={{
          zIndex: 3,
          position: "fixed",
          top: 0,
          left: 0,
          padding: "3em"
        }}
        onClick={exit}
      />
      <Video controls>
        <source src="http://localhost:5000/video" type="video/mp4" />;
      </Video>
    </Box>
  );
};
