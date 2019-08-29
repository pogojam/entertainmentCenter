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

const MoviePreview = memo(Props => {
  const { data, handleClick } = Props;
  console.log("New Set", Props);
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
      ref={containerRef}
      onClick={e => {
        handleClick(data);
      }}
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
});

const MainPreview = ({ img, Year, Plot, Poster, Awards, Title }) => {
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

  const [loading, setLoad] = useState(true);
  useEffect(() => {
    loading && setLoad(!loading);
    return () => {
      setLoad();
    };
  }, [loading]);

  const transitions = useTransition(loading, null, {
    from: { opacity: 0, transform: "translateX(-100%)" },
    enter: { opacity: 1, transform: "translateX(0)" },
    leave: { opacity: 1, transform: "translateX(0)" }
  });

  return (
    <Flex
      style={{
        height: "60vh",
        width: "100%",
        zIndex: 2,
        position: "absolute",
        top: 0,
        background: "linear-gradient(rgb(2, 2, 2) 60%, rgba(0, 0, 0, 0))"
      }}
    >
      <Box p="3em">
        <Heading color="#d6d6d6" p="1em" m="3em" mb="1em">
          {Title}
        </Heading>
        <hr style={{ color: "white", width: "40%" }} />
        <Card color="white" fontSize=".8em">
          <Text px="8em" pb="3em">
            {Plot}
          </Text>
          <Text textAlign="center" fontSize=".4em">
            {Year}
            {Awards}
          </Text>
        </Card>
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
        {transitions.map(
          ({ item, key, props }) =>
            item && (
              <>
                <ImageContainer
                  key={key}
                  borderRadius={"6px"}
                  m="3em"
                  style={props}
                  src={Poster}
                />
                {console.log("dsfsd", item)}
              </>
            )
        )}
      </Card>
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
            <MoviePreview key={i} data={e} handleClick={handleClick} />
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
  const scrollRef = useRef(null);
  const categories = genres;

  useEffect(() => {
    console.log(window);
    window.addEventListener("scroll", pos => {
      console.log(pos);
    });
    return () => {};
  }, [isTop]);

  return (
    <Box ref={scrollRef}>
      <MainPreview welcome={isTop} {...inspect} />
      <Box pt="60vh">
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
