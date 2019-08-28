import React, { useState, useRef } from "react";
import { Upload, VideoPlayer } from "../components/upload";
import { Box, Image, Flex, Button, Card, Heading, Text } from "rebass";
import { useQuery, useMutation } from "@apollo/react-hooks";
import genres from "../library/genres.json";
import gql from "graphql-tag";
import { useSpring, animated, interpolate } from "react-spring";
import ImageFilter from "react-image-filter";

const queryMovies = gql`
  query getMovies($input: String) {
    getMovies(input: $input) {
      Title
      Rated
      Year
      Awards
      Genre
      Plot
      Poster
    }
  }
`;

// const queryCategories = gql`
//   getCategories{

//   }
// `;

const MoviePreview = ({ playMovie, data, handleClick }) => {
  const { Poster } = data;
  const propsBackground = useSpring({ size: 1, from: { size: 3 } });

  const Container = animated(Flex);

  const containerRef = useRef(null);

  const trans = (x, y, s) =>
    `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

  const [props, set] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 5, tension: 350, friction: 40 }
  }));

  const calc = (x, y) => [
    -(y - containerRef.current.clientHeight / 2) / 20,
    (x - containerRef.current.clientWidth / 2) / 20,
    1.1
  ];

  return (
    <Container
      borderRadius="3px"
      maxWidth="20vw"
      ref={containerRef}
      onClick={() => handleClick(data)}
      onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
      onMouseLeave={() => set({ xys: [0, 0, 1] })}
      className="animated fadeIn"
      style={{ transform: props.xys.interpolate(trans) }}
    >
      <Image
        src={Poster}
        borderRadius="3px"
        style={{
          height: "100%",
          zIndex: "-1",
          transform: `scale(${propsBackground.size})`,
          boxShadow: "-2px 0px 14px 0px rgba(0,0,0,0.75)"
        }}
      />
    </Container>
  );
};

const MainPreview = ({ img, Year, Plot, Poster, Awards, Title }) => {
  return (
    <Flex
      style={{
        height: "60vh",
        width: "100%",
        backgroundColor: "black",
        zIndex: 2
      }}
    >
      <Box>
        <Heading p="3em">{Title}</Heading>
        <Card color="white">
          <Text>{Year}</Text>
          <Text px="8em">{Plot}</Text>
          <Text>{Awards}</Text>
        </Card>
      </Box>
      <Image width={[1 / 2]} co src={Poster} alt="" />
    </Flex>
  );
};

const Slider = ({ handleClick, category }) => {
  const {
    loading,
    error,
    data: { getMovies: data }
  } = useQuery(queryMovies, {
    variables: { input: category }
  });

  !loading && console.log(data, category, error);

  return (
    <>
      {!loading && data.length > 0 && (
        <Flex
          bg="#fd0101"
          my="5em"
          p=".5em"
          style={{
            height: "40vh",
            position: "relative"
          }}
          width="100%"
        >
          <Heading
            color="white"
            fontWeight={100}
            pl="2em"
            style={{ position: "absolute", left: 0, top: "-2em" }}
          >
            {category}
          </Heading>
          {data.map(e => (
            <MoviePreview
              key={e.Title}
              data={e}
              handleClick={handleClick}
              playMovie={handleClick}
            />
          ))}
        </Flex>
      )}
    </>
  );
};

export default function Movies() {
  const [upload, toggleUpload] = useState(false);
  const [player, togglePlayer] = useState(false);
  const [inspect, toggleInspect] = useState(false);

  const categories = genres;

  return (
    <Box>
      <MainPreview {...inspect} />
      <Box>
        {categories.map((category, i) => {
          return (
            <Slider
              handleClick={toggleInspect}
              key={categories + i}
              togglePlayer={togglePlayer}
              category={category}
            />
          );
        })}
      </Box>
      <Button
        bg="#000000"
        color="#22ce99"
        onClick={() => toggleUpload(!upload)}
        style={{
          position: "fixed",
          bottom: "-3px"
        }}
      >
        {" "}
        Contribute
      </Button>
      {player && <VideoPlayer />}
      {upload && <Upload toggle={toggleUpload} />}
    </Box>
  );
}
