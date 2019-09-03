import React, { useState } from "react";
import { Flex, Card, Text } from "rebass";
import { MdFolder } from "react-icons/md";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const QUERY = gql`
  query getFiles($input: String) {
    getFiles(input: $input) {
      isFolder
      name
      fileName
      path
      extension
    }
  }
`;

const handleFolderClick = (set, data) => {
  set(data);
};

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
  <Container {...props}>{fileName}</Container>
);

const DirectoryCard = ({ name, path, ...props }) => {
  const { sub, set } = useState(null);
  const { loading, data, error } = useQuery(QUERY, {
    variables: path
  });

  return (
    <Container {...props} onClick={() => handleFolderClick(set, data)}>
      <MdFolder />
      <Text textAlign="left" width="100%">
        {name}
      </Text>
      {sub &&
        sub.map(({ isFolder, ...props }, i) =>
          isFolder ? (
            <DirectoryCard index={i} {...props} />
          ) : (
            <FileCard index={i} {...props} />
          )
        )}
    </Container>
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
