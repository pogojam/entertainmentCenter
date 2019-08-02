import React, { useState, useEffect } from "react";
import { Flex, Button } from "rebass";
import io from "socket.io-client";

const uploadEvent = data => {
  const socket = io("http://localhost:5000");

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

const Upload = params => {
  const [fileData, setFile] = useState(null);

  useEffect(() => {}, []);
  console.log(fileData);
  return (
    <Flex
      style={{ height: "100vh" }}
      alignItems="center"
      justifyContent="center"
    >
      <input
        type="file"
        accept="video/*"
        multiple
        onChange={e => setFile(e.target.files)}
      />
      {fileData && (
        <Button onClick={() => uploadEvent(fileData)}> Upload </Button>
      )}
    </Flex>
  );
};

export default Upload;
