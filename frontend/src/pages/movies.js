import React, { useState, useRef, useEffect, memo } from "react";
import { Upload, VideoPlayer } from "../components/upload";
import { Box, Image, Flex, Button, Card, Heading, Text } from "rebass";
import { useQuery, useMutation } from "@apollo/react-hooks";
import genres from "../library/genres.json";
import { useObserver } from "../util";
import gql from "graphql-tag";
import { useScroll, useGesture, useWheel } from "react-use-gesture";
import {
  useSpring,
  useTransition,
  config,
  useTrail,
  animated,
  interpolate,
} from "react-spring";
import styled from "styled-components";

const AnimationBox = animated(styled(Box)`
  @media (max-width: 900px) {
  }
`);
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
    config: { mass: 5, tension: 350, friction: 40 },
  }));

  const calc = (x, y) => {
    const con = containerRef.current.getBoundingClientRect();
    return [
      -(y - con.top - con.height / 2) / 20,
      (x - con.left - con.width / 2) / 20,
      1.1,
    ];
  };

  return (
    <Container
      borderRadius="3px"
      ref={containerRef}
      onClick={(e) => {
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
        borderRadius: "15px",
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

const MainPreviewStyles = animated(styled.div`
  text-align: center;
  display: flex;
  width: 40%;
  height: 100%;
  top: 0;
  right: 0;

  @media (max-width: 600px) {
    background-color: black;
    top: 0;
    left: 0;
    width: 100%;
    height: 40vh;
    transform: translate(0, -100);
    backdrop-filter: blur(5px);
    background-color: #79757580;
  }
`);
const MainPreview = ({
  img,
  Year,
  Plot,
  Poster,
  Awards,
  Title,
  togglePlayer,
  show,
}) => {
  const [showDrawer, setDrawer] = useState(false);
  const isMobile = window.innerWidth < 600;
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
    exit: () => togglePlayer(false),
  };

  const transition = {
    config: (item, type) => {
      if (type === "leave") return { tension: 500, friction: 400 };
      if (type === "enter") return config.molasses;
    },
    from: { opacity: 0, transform: "translateX(-30%) translateY(0%)" },
    enter: { opacity: 1, transform: "translateX(0%) translateY(0%) " },
    leave: { opacity: 0, transform: "translateX(30%) translateY(0%)" },
  };
  const animation = useTransition(Title, null, transition);

  const drawSlide = useSpring({
    transform: showDrawer ? "translate(0,0%)" : "translate(0,-100%)",
  });

  useEffect(() => {
    if (!isMobile) return setDrawer(true);
    if (Title) {
      console.log(Title);
      setDrawer(true);
      console.log(showDrawer);
    }
    if (show) return setDrawer(true);
    if (!show) return setDrawer(false);
  }, [Title, show]);

  return (
    <MainPreviewStyles
      ref={containerRef}
      className="MainPreview"
      style={{
        position: "fixed",
        zIndex: 1,
        ...drawSlide,
        // background: "linear-gradient(rgb(2, 2, 2) 60%, rgba(0, 0, 0, 0))"
      }}
    >
      {animation.map(({ item, props }, i) =>
        item ? (
          <AnimationBox
            key={i}
            p={["10px", "3em"]}
            style={{
              right: 0,
              position: "absolute",
              height: "100%",
              width: "100%",
              flexDirection: "column",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
              ...props,
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
                ...props,
              }}
            >
              {!isMobile && (
                <ImageContainer borderRadius={"6px"} m="3em" src={Poster} />
              )}
            </AnimationCard>

            <Heading
              color="#d6d6d6"
              fontSize={["6vw", "4em"]}
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
              <Text textAlign={isMobile ? "center" : "left"}>{Plot}</Text>
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
              <Heading
                style={{ marginRight: "3em" }}
                color="white"
                fontSize={["3em", "7em"]}
              >
                BroFlix
              </Heading>
            </Flex>
          </animated.div>
        )
      )}
    </MainPreviewStyles>
  );
};

const Slider = ({ handleClick, category, Slide }) => {
  const { loading, error, data } = useQuery(queryMovies, {
    variables: { input: category },
  });
  const movieData = data ? data.getMovies : null;
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
      1.0,
    ],
  });

  const [scrollAnim, setAnim] = useSpring(() => ({
    opc: [1],
    sp: [0, 0],
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
      {!loading && movieData.length > 0 && (
        <animated.div
          style={{
            opacity: scrollAnim.opc.interpolate((e) => e),
            transformOrigin: "center center",
            transform: scrollAnim.sp.interpolate(
              (e, s) => `rotate(${e}deg) scale(${s}) `
            ),
          }}
        >
          <Flex
            ref={ref}
            my="5em"
            p="1.5em"
            style={{
              height: "17em",
              position: "relative",
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
            {movieData.map((e, i) => (
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
  const [previewState, togglePreview] = useState(false);
  const boxRef = useRef(null);
  const categories = genres;

  const bindScroll = useWheel((e) => {
    const goingDown = e.delta[1] < 0 ? true : false;
    const shouldChage = e.velocity > 1 ? true : false;
    if (shouldChage && !goingDown) {
      return togglePreview(false);
    }
    if (shouldChage & goingDown) {
      return togglePreview(true);
    }
  });

  return (
    <Box
      ref={boxRef}
      style={{ display: "flex", height: "100%", flexDirection: "column" }}
    >
      <MainPreview
        show={previewState}
        togglePlayer={togglePlayer}
        welcome={isTop}
        {...inspect}
      />
      <Box {...bindScroll()} mt="10vh" px={["0em", "6em"]}>
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
          zIndex: 4,
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
