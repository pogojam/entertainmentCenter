import React, { useState, useRef, useEffect } from "react";
import styled, { css } from "styled-components";
import { Flex, Button, Box } from "rebass";
import { TiArrowLeftThick } from "react-icons/ti";
import io from "socket.io-client";
import ss from "socket.io-stream";
import fileReaderStream from "filereader-stream";
import {
  Container,
  ListItem,
  CircularProgress,
  ListItemText,
  List,
  Typography,
} from "@material-ui/core";
import { FiSlack } from "react-icons/fi";

const socket = io(window.location.hostname + ":5000");

// const uploadEvent = (data) => {
//   const uploadSize = 524288;
//   let MovieBuffers = {};

//   const loadFile = (file) => {
//     const fReader = new FileReader();
//     MovieBuffers[file.name] = {
//       name: file.name,
//       place: 0,
//       size: file.size,
//       fReader,
//     };
//     fReader.onload = (event) => {
//       if (!MovieBuffers[file.name].hasOwnProperty("data")) {
//         MovieBuffers[file.name].data = event.target.result;
//         socket.emit("Start", {
//           name: file.name,
//           size: file.size,
//           newFile: true,
//         });
//         return;
//       }
//       const { name, place, data } = MovieBuffers[file.name];
//       socket.emit("Upload", {
//         name,
//         place,
//         data: data.slice(
//           place,
//           place + Math.min(uploadSize, MovieBuffers[name].size - place)
//         ),
//       });
//     };
//     socket.on("MoreData", function ({ place, name, exists }) {
//       // UpdateBar(data['Percent']);
//       place = place * uploadSize; //The Next Blocks Starting Position
//       const NewFileArray = MovieBuffers[name].data.slice(
//         place,
//         place + Math.min(uploadSize, MovieBuffers[name].size - place)
//       );
//       console.log(
//         place,
//         place + Math.min(uploadSize, MovieBuffers[name].size - place)
//       );

//       const NewFile = new Blob([NewFileArray]);
//       fReader.readAsArrayBuffer(NewFile);
//     });

//     fReader.readAsArrayBuffer(file);
//   };

//   for (let i = 0; i < data.length; ++i) {
//     loadFile(data[i]);
//   }
// };

export const uploadFile = async (files, setProgress) => {
  const filesToUpload = Object.values(files).map((file, index) => ({
    name: file.name,
    size: file.size,
    uploadProgress: 0,
    file,
    index,
  }));
  setProgress(filesToUpload);
  // Request for each file for pending upload
  console.log("Client Upload");
  ss(socket).emit("pendUpload", filesToUpload);

  ss(socket).on("getFile", ({ name, index }) => {
    console.log("Getting File", name, index);
    const tottalSize = filesToUpload[index].size;
    const newFileStream = ss.createStream();
    ss(socket).emit("fileUpload", newFileStream, { tottalSize, index, name });
    fileReaderStream(filesToUpload[index].file).pipe(newFileStream);
  });

  socket.on("setFileProgress", ({ error, index, uploadProgress }) => {
    setProgress((state) => {
      console.log(state, index, error);
      state[index].error = error;
      state[index].uploadProgress = uploadProgress;
      return [...state];
    });
  });
};

const UploadStatus = ({ error, uploadProgress, name, file }) => {
  return (
    <ListItem>
      <ListItemText secondary={file.size} primary={name} />
      {!error && <CircularProgress variant="static" value={uploadProgress} />}
      {error && <Typography color="error">{error}</Typography>}
    </ListItem>
  );
};

export const Upload = ({ toggle }) => {
  const [fileData, setFile] = useState(null);
  const [uploadProgress, setProgress] = useState(null);

  return (
    <Flex
      style={{ height: "100vh", position: "absolute", top: "0", zIndex: 999 }}
      bg="#a9a9a98a"
      width="100%"
      alignItems="center"
      justifyContent="center"
      onClick={(e) => toggle(false)}
    >
      <Box
        style={{
          borderRadius: "6px",
          padding: "8em",
          backgroundColor: "whitesmoke",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="file"
          accept="video/*"
          multiple
          onChange={(e) => setFile(e.target.files)}
        />
        {fileData && (
          <Button
            onClick={() => uploadFile(fileData, setProgress) & setFile(null)}
          >
            Upload
          </Button>
        )}
        {uploadProgress && (
          <List>
            {uploadProgress.map((progress) => (
              <UploadStatus {...progress} />
            ))}
          </List>
        )}
      </Box>
    </Flex>
  );
};

export const VideoPlayer = ({ fullScreen, exit, Path }) => {
  const handleMove = () => {};
  const playerRef = useRef();
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
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.play();
    }
  }, []);
  const videoSource =
    "http://" + window.location.hostname + ":5000/video?path=" + Path;
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
          padding: "3em",
        }}
        onClick={exit}
      />
      <Video ref={playerRef} autoPlay={true} controls>
        <source src={videoSource} type="video/mp4" />;
      </Video>
    </Box>
  );
};
