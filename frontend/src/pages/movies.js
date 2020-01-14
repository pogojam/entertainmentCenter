import React, { useState, useRef, useEffect, memo } from "react";
import { Upload, VideoPlayer } from "../components/upload";
import { Box, Image, Flex, Button, Card, Heading, Text } from "rebass";
import { useQuery, useMutation } from "@apollo/react-hooks";
import genres from "../library/genres.json";
import { useObserver } from "../util";
import gql from "graphql-tag";
import {
  useSpring,
  useTransition,
  config,
  useTrail,
  animated,
  interpolate
} from "react-spring";
import styled from "styled-components";

const AnimationBox = animated(Box);
const AnimationCard = animated(Card);

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

  const calc = (x, y) => {
    const con = containerRef.current.getBoundingClientRect();
    return [
      -(y - con.top - con.height / 2) / 20,
      (x - con.left - con.width / 2) / 20,
      1.1
    ];
  };

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
      mr="1em"
      style={{
        background: `url(${data.Poster})`,
        boxShadow: "-2px 0px 14px 0px rgba(0,0,0,0.75)",
        transform: props.xys.interpolate(trans),
        backgroundSize: "cover",
        height: "100%",
        width: "15em",
        borderRadius: "15px"
      }}
    >
      {/* <Image
        src={data.Poster}
        borderRadius="3px"
        style={{
          height: "100%",
          zIndex: "-1",
          transform: `scale(${propsBackground.size})`
        }}
      /> */}
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

  const playerOptions = {
    fullScreen: true,
    exit: () => togglePlayer(false)
  };

  const transition = {
    config: (item, type) => {
      if (type === "leave") return config.molasses;
      if (type === "enter") return config.molasses;
    },
    from: { opacity: 0, transform: "translateX(-30%) translateY(0%)" },
    enter: { opacity: 1, transform: "translateX(0%) translateY(0%) " },
    leave: { opacity: 0, transform: "translateX(30%) translateY(0%)" }
  };
  const animation = useTransition(Title, null, transition);

  return (
    <Flex
      ref={containerRef}
      className="MainPreview"
      style={{
        zIndex: 2,
        width: "70%",
        height: "100%",
        top: 0,
        right: 0,
        position: "fixed"
        // background: "linear-gradient(rgb(2, 2, 2) 60%, rgba(0, 0, 0, 0))"
      }}
    >
      {animation.map(({ item, props }, i) =>
        item ? (
          <AnimationBox
            key={i}
            p="3em"
            style={{
              right: 0,
              position: "absolute",
              maxWidth: "45vw",
              height: "100%",
              flexDirection: "column",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
              zIndex: 0,
              ...props
            }}
          >
            <AnimationCard
              width={["50vw"]}
              style={{
                left: 0,
                top: 0,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...props
              }}
            >
              <ImageContainer borderRadius={"6px"} m="3em" src={Poster} />
            </AnimationCard>

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
              maxWidth="8em"
              alignSelf="center"
            >
              Watch
            </Button>
          </AnimationBox>
        ) : (
          <animated.div
            key={i}
            style={{ ...props, margin: "auto", alignSelf: "center" }}
          >
            <Flex width={[1]} justifyContent="center" alignItems="center">
              <Heading color="white" fontSize="7em">
                BroFlix
              </Heading>
            </Flex>
          </animated.div>
        )
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

  const wasAbove = useRef(false);

  const [ref, entry] = useObserver({
    threshold: [
      0.0,
      0.1,
      0.2,
      0.3,
      0.4,
      0.5,
      0.6,
      0.7,
      0.8,
      0.85,
      0.9,
      0.95,
      0.98,
      1.0
    ]
  });

  const [scrollAnim, setAnim] = useSpring(() => ({
    opc: [1],
    sp: [0, 0]
  }));

  const calcSpin = (entry, deg) => {
    if (entry.isIntersecting) {
      const isAbove = entry.boundingClientRect.y < entry.rootBounds.y;
      const ir = entry.intersectionRatio;
      let scale = ir;
      let roation = 0;
      if (wasAbove.current) {
        // Comes from top
        roation = deg - deg * ir;
      } else {
        roation = deg - deg * ir;
      }

      wasAbove.current = isAbove;
      return [roation, scale];
    }
  };

  useEffect(() => {
    const inr = entry.intersectionRatio;
    if (inr) {
      inr >= 0 && setAnim({ opc: [inr], sp: calcSpin(entry, 90) });
    }
  }, [entry, setAnim]);

  return (
    <>
      {!loading && data.length > 0 && (
        <animated.div
          style={{
            opacity: scrollAnim.opc.interpolate(e => e),
            transformOrigin: "center center",
            transform: scrollAnim.sp.interpolate(
              (e, s) => `rotate(${e}deg) scale(${s}) `
            )
          }}
        >
          <Flex
            ref={ref}
            my="5em"
            p="1.5em"
            style={{
              height: "17em",
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
              <Slide key={i} handleClick={handleClick} {...e} />
            ))}
          </Flex>
        </animated.div>
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

  return (
    <Box
      ref={boxRef}
      style={{ display: "flex", height: "100%", flexDirection: "column" }}
    >
      <MainPreview togglePlayer={togglePlayer} welcome={isTop} {...inspect} />
      <Box mt="10vh">
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
        bg="red"
        color="black"
        onClick={() => toggleUpload(!upload)}
        style={{
          position: "fixed",
          right: "0",
          bottom: "-3px",
          zIndex: 4
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
