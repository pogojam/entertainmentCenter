import React, { useState, useRef } from "react";
import { Flex, Card, Text } from "rebass";
import { MdFolder, MdControlPoint, MdChevronRight } from "react-icons/md";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useSpring, animated } from "react-spring";
import { uploadFile } from "../components/upload";

const QUERY = gql`
  query getFiles($input: String) {
    getFiles(input: $input) {
      isFolder
      name
      fileName
      dir
      path
      extension
    }
  }
`;

const ADD_FOLDER = gql`
  mutation addFolder($path: String, $name: String) {
    addFolder(path: $path, name: $name) {
      path
      name
    }
  }
`;

const Container = ({ children, index, ...props }) => (
  <Flex
    p=".5em"
    bg={index % 2 === 0 ? "bisque" : "white"}
    alignItems="center"
    {...props}
  >
    {children}
  </Flex>
);

const FileCard = ({ fileName, ...props }) => (
  <Container {...props}>
    <MdChevronRight style={{ opacity: 0 }} />
    {fileName}
  </Container>
);

const DirectoryCard = ({ name, fileName, dir, path, subRefetch, ...props }) => {
  const [sub, set] = useState(null);
  const [isEnter, setEnter] = useState(null);
  const { data, refetch } = useQuery(QUERY, {
    variables: { input: path + fileName + "/" },
  });

  const handleFolderClick = () => {
    if (!sub) return set(data.getFiles);
    set(null);
  };

  const handleRefetch = (fetch) => {
    fetch();
    set(data.getFiles);
  };

  const rotateArrow = useSpring(
    sub ? { transform: "rotate(90deg)" } : { transform: "rotate(0deg)" }
  );
  const animDrag = useSpring(
    isEnter ? { backgroundColor: "blue" } : { backgroundColor: "black" }
  );

  const dragEvents = {
    onDragOver: (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!sub) set(data.getFiles);
    },
    onDragLeave: (e) => {},
    onDrop: (e) => {
      e.preventDefault();
      e.stopPropagation();
      const dt = e.dataTransfer;
      const files = dt.files;
      [...files].forEach((file) =>
        uploadFile(file, path + fileName + "/", () =>
          handleRefetch(subRefetch ? subRefetch : refetch)
        )
      );
    },
  };

  return (
    <>
      <animated.div {...dragEvents} style={animDrag}>
        <Container {...props} onClick={handleFolderClick}>
          <animated.div style={{ ...rotateArrow, display: "flex" }}>
            <MdChevronRight />
          </animated.div>
          <MdFolder />
          <Text textAlign="left" width="100%">
            {fileName}
          </Text>
        </Container>
        {sub &&
          sub.map(({ isFolder, ...props }, i) =>
            isFolder ? (
              <DirectoryCard
                subRefetch={refetch}
                key={i}
                index={i}
                {...props}
              />
            ) : (
              <FileCard key={i} index={i} {...props} />
            )
          )}
      </animated.div>
    </>
  );
};

const Menue = ({ setMode }) => {
  const handleAddFolder = (path) => {
    setMode("addFolder");
  };

  return (
    <Flex bg="#909090" flexDirection="column" p={["1em"]}>
      <Card
        style={{ alignSelf: "flex-end", display: "flex", alignItems: "center" }}
        onClick={handleAddFolder}
      >
        <MdControlPoint />
        Folder
      </Card>
    </Flex>
  );
};

const AddFolder = () => {
  const [addFolder] = useMutation(ADD_FOLDER);
  const inputRef = useRef(null);
  return (
    <Flex p="1em" bg="white ">
      <MdFolder />
      <input ref={inputRef} type="text" />{" "}
      <MdControlPoint
        onClick={() =>
          addFolder({ variables: { path: "/", name: inputRef.current.value } })
        }
      />{" "}
    </Flex>
  );
};

export default function Storage() {
  const [mode, setMode] = useState(null);
  const { loading, data, error, refetch } = useQuery(QUERY, {
    variables: { input: "/" },
  });

  return (
    <Flex
      style={{ borderRadius: "3px", height: "90%" }}
      bg="#cecece"
      p="1em"
      m={["0", "3em"]}
    >
      <Card
        style={{ borderRadius: "3px", height: "100%", overflowY: "scroll" }}
        width="100%"
        bg="#131331"
      >
        <Menue setMode={setMode} />
        {loading
          ? "...loading"
          : data.getFiles.map(({ isFolder, ...props }, i) =>
              isFolder ? (
                <DirectoryCard index={i} {...props} />
              ) : (
                <FileCard index={i} {...props} />
              )
            )}
        {mode === "addFolder" && <AddFolder />}
      </Card>
    </Flex>
  );
}
