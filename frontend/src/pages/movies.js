import React, { useState } from "react";
import { Upload, VideoPlayer } from "../components/upload";
import { Box, Image, Flex, Button, Card, Heading, Text } from "rebass";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useSpring, animated } from "react-spring";
import ImageFilter from "react-image-filter";

const queryMovies = gql`
  {
    getMovies {
      Title
      Rated
      Year
      Awards
      Plot
      Poster
    }
  }
`;

// const queryCategories = gql`
//   getCategories{

//   }
// `;

const MoviePreview = ({ playMovie, data }) => {
  const { Poster, Title } = data;

  const [inspect, toggleInspect] = useState(false);
  const handleClick = () => toggleInspect(!inspect);

  const props = useSpring({ size: 1, from: { size: 3 } });

  const Background = animated(ImageFilter);

  return (
    <Card
      style={{
        height: "100%",
        color: "white",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}
      borderRadius="3px"
      maxWidth="20vw"
      onClick={handleClick}
      className="animated fadeIn"
    >
      <Background
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          zIndex: "-1",
          transform: `scale(${props.size})`
        }}
        preserveAspectRatio="cover"
        image={Poster}
        filter={"duotone"}
        colorOne={[0, 0, 0]}
        colorTwo={[255, 255, 255]}
      />
      <Heading fontSize={[5]} py="3em">
        {Title}
      </Heading>
      {inspect && <MainPreview {...data} />}
    </Card>
  );
};

const MainPreview = ({ img, Year, Plot, Poster, Awards, Title }) => {
  return (
    <Flex
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "80vh",
        backgroundColor: "black",
        zIndex: -5
      }}
    >
      <Box>
        <Heading p="3em">{Title}</Heading>
        <Card>
          <Text>{Year}</Text>
          <Text>{Plot}</Text>
          <Text>{Awards}</Text>
        </Card>
      </Box>
      <Image width={[1 / 2]} co src={Poster} alt="" />
    </Flex>
  );
};

const Slider = ({ togglePlayer, categories }) => {
  const handleClick = () => togglePlayer(true);

  const {
    loading,
    error,
    data: { getMovies: data }
  } = useQuery(queryMovies);

  !loading && console.log(data, error);

  return (
    <Box bg="#fd0101" my="5em" p=".5em" style={{ height: "40vh" }} width="100%">
      <Heading>{categories}</Heading>
      {!loading &&
        data.map(e => (
          <MoviePreview key={e.Title} data={e} playMovie={handleClick} />
        ))}
    </Box>
  );
};

export default function Movies() {
  const [upload, toggleUpload] = useState(false);
  const [player, togglePlayer] = useState(false);
  // const {loading,error,data}  = useQuery(queryCategories)

  const data = [{ categories: "dfs" }];

  return (
    <div>
      {data.map(({ categories }) => {
        return (
          <Slider
            key={categories}
            togglePlayer={togglePlayer}
            name={categories}
          />
        );
      })}
      <Button
        bg="#000000"
        color="#22ce99"
        onClick={() => toggleUpload(!upload)}
        style={{ position: "absolute", bottom: "0" }}
      >
        {" "}
        Contribute
      </Button>
      {player && <VideoPlayer />}
      {upload && <Upload toggle={toggleUpload} />}
    </div>
  );
}
