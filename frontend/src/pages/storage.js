import React, { useState } from "react";
import { Flex, Card, Text } from "rebass";
import { MdFolder, MdChevronRight } from "react-icons/md";
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

const MUTATION = gql`
  mutation uploadFiles($file: Upload!, $meta: FileInput!) {
    uploadFiles(file: $file, meta: $meta) {
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

const DirectoryCard = ({ name, fileName, dir, path, ...props }) => {
  const [sub, set] = useState(null);
  const [isEnter, setEnter] = useState(null);
  const { loading, data, error } = useQuery(QUERY, {
    variables: { input: path + fileName + "/" }
  });

  const handleFolderClick = () => {
    if (!sub) return set(data.getFiles);
    set(null);
  };

  const rotateArrow = useSpring(
    sub ? { transform: "rotate(90deg)" } : { transform: "rotate(0deg)" }
  );
  const animDrag = useSpring(
    isEnter ? { backgroundColor: "blue" } : { backgroundColor: "black" }
  );

  const dragEvents = {
    onDragOver: e => {
      e.stopPropagation();
      e.preventDefault();
      if (!sub) set(data.getFiles);
    },
    onDragLeave: e => {},
    onDrop: e => {
      e.preventDefault();
      e.stopPropagation();
      const dt = e.dataTransfer;
      const files = dt.files;
      console.log(path, fileName);
      [...files].forEach(file => uploadFile(file, path + fileName + "/"));
    }
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
              <DirectoryCard key={i} index={i} {...data} />
            ) : (
              <FileCard key={i} index={i} {...props} />
            )
          )}
      </animated.div>
    </>
  );
};

export default function Storage() {
  const { loading, data, error } = useQuery(QUERY, {
    variables: { input: "/" }
  });

  !loading && console.log(data);

  return (
    <Flex
      style={{ borderRadius: "3px", height: "90%" }}
      bg="#cecece"
      p="1em"
      m="3em"
    >
      <Card
        style={{ borderRadius: "3px", height: "100%", overflowY: "scroll" }}
        width="100%"
        bg="#131331"
      >
        {loading
          ? "...loading"
          : data.getFiles.map(({ isFolder, ...props }, i) =>
              isFolder ? (
                <DirectoryCard index={i} {...props} />
              ) : (
                <FileCard index={i} {...props} />
              )
            )}
      </Card>
    </Flex>
  );
}
