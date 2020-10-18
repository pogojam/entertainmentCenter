import React, { useState, useRef, useEffect, memo } from "react";
import { Upload, VideoPlayer } from "../components/upload";
import { Box, Image, Flex, Heading, Text } from "rebass";
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
import { observer } from "mobx-react-lite";
import { Container,Typography, CardMedia,Button, CardHeader ,CardContent,Card} from "@material-ui/core";
import Loader from "../components/loader";
import MovieStore from '../components/state/stores/Movie_Store'

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
      Path
    }
  }
`;

const MovieCard= memo(({ handleClick, ...data }) => {
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
        MovieStore.setActivePreviewMovie(data)
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
    />
  );
});

const MainPreviewStyles = animated(styled.div`
  z-index:1;
  position:fixed;
  display: flex;
  top: 0;
  left: 0;
  width: 100%;
  height: 40vh;
  transform: translate(0, -100);
  backdrop-filter: blur(5px);
  background-color: #79757580;
`);
const MainPreview = ({
  img,
  Year,
  Plot,
  Poster,
  Awards,
  Title,
  show,
  Path,
}) => {
  const [showDrawer, setDrawer] = useState(false);
  const containerRef = useRef(null);
  const justMounted = useRef(false);

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
    if (justMounted.current) {
      justMounted.current = false;
      return;
    }
    if (Title) {
      setDrawer(true);
    }
    if (show) return setDrawer(true);
    if (!show) return setDrawer(false);
  }, [Title, show]);

  return (
    <MainPreviewStyles
      ref={containerRef}
      style={{
        ...drawSlide,
      }}
    >
      {animation.map(({ item, props }, i) =>
        item ? (
          <Card
            key={i}
            style={{
              
              right: 0,
              backgroundColor:'transparent',
              position: "absolute",
              height: "100%",
              width: "100%",
              ...props,
            }}
          >
            
                <CardMedia style={{position:'absolute',zIndex:-1,opacity:.8}} component="img" src={Poster.replace("300",window.innerWidth)} />

            <Typography
variant="h1"
           style={{textAlign:'left',marginTop:'70px',letterSpacing:'6px'}} 
            >
            {Title}</Typography>
            <Text textAlign="center"  >
              {Year}
              <hr style={{background:'black',border:'none',height:'1px', width: "40%" }} />
              {Awards}
            </Text>

<Box maxWidth={'300px'} m={2} >
              <Typography textAlign={"left"}>{Plot}</Typography>
</Box>
            <Button
            variant="outlined"
              onClick={() => MovieStore.setPlayer(true)}
            >
              Watch
            </Button>

          </Card>
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
        // Slide is at the top of the screeen
        roation = deg - deg * ir;
      } else {
        roation = 0;
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
      {!loading && Array.isArray(movieData) && (
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
              <Slide key={i} {...e} />
            ))}
          </Flex>
        </animated.div>
      )}
    </>
  );
};

const Movies = observer( () => {
  const [upload, toggleUpload] = useState(false);
  const [player, togglePlayer] = useState(false);
  const [inspect, toggleInspect] = useState(false);
  const [isTop, checkPosition] = useState(false);
  const [previewState, togglePreview] = useState(false);
  
  const boxRef = useRef(null);
  const categories = genres;
  const [hasMounted, setMounted] = useState(false);

  const bindScroll = useWheel((e) => {
    const goingDown = e.delta[1] < 0 ? true : false;
    const shouldChage = e.velocity > 0.8 ? true : false;
    if (shouldChage && !goingDown) {
      return togglePreview(false);
    }
    if (shouldChage & goingDown) {
      return togglePreview(true);
    }
  });

  const mountMovies = () => {
    setTimeout(() => {
      setMounted(true);
    }, 500);
  };

  useEffect((params) => {
    mountMovies();
  }, []);

  if (!hasMounted)
    return (
      <Container>
        <Loader />
      </Container>
    );

  return (
    <Box
      ref={boxRef}
      style={{
        display: "flex",
        height: "100%",
        flexDirection: "column",
      }}
    >
      <MainPreview
        show={MovieStore.showPreview}
        {...MovieStore.activePreviewMovie}
      />
      <Box {...bindScroll()} mt="33vh" px={["0em", "6em"]}>
        {categories.map((category, i) => {
          return (
            <Slider
              Slide={MovieCard}
              containerRef={boxRef}
              key={categories + i}
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
          borderTopRightRadius:0
        }}
      >
        {" "}
        Contribute
      </Button>
      {MovieStore.showPlayer && <VideoPlayer videoName={"ballers"} {...player} />}
      {upload && <Upload toggle={toggleUpload} />}
    </Box>
  );
} );
export default Movies;
