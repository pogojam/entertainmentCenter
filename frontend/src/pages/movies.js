import React, { useState, useRef, useEffect, memo } from "react";
import { Upload, VideoPlayer } from "../components/upload";
import { Box, Image, Flex, Button, Card, Heading, Text } from "rebass";
import { useQuery, useMutation } from "@apollo/react-hooks";
import genres from "../library/genres.json";
import gql from "graphql-tag";
import {
  useSpring,
  useTransition,
  useTrail,
  animated,
  interpolate
} from "react-spring";
import styled from "styled-components";

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

const useAnimation = item => {
  const [items, addItem] = useState([]);
};

const MoviePreview = memo(({ handleClick, ...data }) => {
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
      ref={containerRef}
      onClick={e => {
        console.log(data);
        handleClick(data);
      }}
      onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
      onMouseLeave={() => set({ xys: [0, 0, 1] })}
      className="animated fadeIn"
      style={{ transform: props.xys.interpolate(trans) }}
    >
      <Image
        src={data.Poster}
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
});

const MainPreview = ({
  img,
  Year,
  Plot,
  Poster,
  Awards,
  Title,
  togglePlayer
}) => {
  const containerRef = useRef(null);

  const ImageContainer = animated(styled(Image)`
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(rgb(2, 2, 2) 60%, rgba(0, 0, 0, 0));
    }
  `);

  console.log(Poster);

  useEffect(() => {
    const scrollBox = document.querySelector(".App");
    containerRef.current.addEventListener("mousewheel", e => {
      scrollBox.scrollTop += e.deltaY;
    });
  });

  const playerOptions = {
    fullScreen: true,
    exit: () => togglePlayer(false)
  };

  return (
    <Flex
      ref={containerRef}
      style={{
        height: "60vh",
        width: "100%",
        zIndex: 2,
        position: "absolute",
        top: 0,
        background: "linear-gradient(rgb(2, 2, 2) 60%, rgba(0, 0, 0, 0))"
      }}
    >
      {Title ? (
        <>
          {" "}
          <Box p="3em" style={{ maxWidth: "35vw" }}>
            <Heading
              color="#d6d6d6"
              fontSize="4em"
              style={{ whiteSpace: "nowrap" }}
              letterSpacing="16px"
            >
              {Title}
            </Heading>
            <Text textAlign="center" color="white" fontSize=".4em">
              {Year}
              <hr style={{ color: "white", width: "40%" }} />
              {Awards}
            </Text>
            <Card pt="1em" color="white" fontSize=".8em">
              <Text textAlign="left">{Plot}</Text>
            </Card>
            <Button
              m=".5em"
              onClick={() => togglePlayer(playerOptions)}
              bg="white"
              color="black"
            >
              Watch
            </Button>
          </Box>
          <Card
            width={["50vw"]}
            style={{
              right: 0,
              top: 0,
              zIndex: -1,
              height: "100%",
              position: "absolute"
            }}
          >
            <ImageContainer
              className="animated fadeIn"
              borderRadius={"6px"}
              m="3em"
              src={Poster}
            />
          </Card>
        </>
      ) : (
        <Flex width={[1]} justifyContent="center" alignItems="center">
          <Heading color="white" fontSize="7em">
            BroFlix
          </Heading>
        </Flex>
      )}
    </Flex>
  );
};

const Slider = ({ handleClick, category, Slide }) => {
  const {
    loading,
    error,
    data: { getMovies: data }
  } = useQuery(queryMovies, {
    variables: { input: category }
  });
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
          {data.map((e, i) => (
            <Slide handleClick={handleClick} {...e} />
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
  const [isTop, checkPosition] = useState(false);
  const boxRef = useRef(null);
  const categories = genres;

  const [set, props] = useSpring(() => ({ opacity: 1 }));

  useEffect(() => {
    console.log(window);
    const scrollBox = document.querySelector(".App");
    scrollBox.addEventListener("scroll", pos => {
      console.log(boxRef.current.offsetTop);
    });
    return () => {};
  }, [isTop]);

  return (
    <Box ref={boxRef}>
      <MainPreview togglePlayer={togglePlayer} welcome={isTop} {...inspect} />
      <Box pt="60vh">
        {categories.map((category, i) => {
          return (
            <Slider
              Slide={MoviePreview}
              containerRef={boxRef}
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
      {player && <VideoPlayer {...player} />}
      {upload && <Upload toggle={toggleUpload} />}
    </Box>
  );
}
