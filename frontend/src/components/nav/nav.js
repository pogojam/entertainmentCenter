import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Flex, Image, Button } from "rebass";
import { useSpring, animated } from "react-spring";
import { pages } from "../../pages/build.json";
//Stores
import AuthStore from "../state/stores/Auth_Store";

const StyledButton = styled(Button)`
  transition: transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  &:hover {
    transform: scale(1.2);
  }
`;
const NavButton = ({ name, path, onClick }) => {
  return (
    <Link to={path}>
      <StyledButton
        onClick={onClick}
        bg="transparent"
        m={["", "1em"]}
        mt={[".5em", "1em"]}
        px={[".5em"]}
      >
        {name}
      </StyledButton>
    </Link>
  );
};

const ActiveBackground = React.memo(({ pageIndex, width }) => {
  const [slideAnim, setAnimSlide] = useSpring(() => ({
    x: [width - width * pageIndex],
  }));
  useEffect(() => {
    setAnimSlide({
      x: [width - width * pageIndex],
    });
  }, [pageIndex]);

  return (
    <animated.div
      style={{
        position: "absolute",
        backgroundColor: "red",
        top: 0,
        left: 0,
        height: "100%",
        width: "calc(100%/5)",
        zIndex: -1,
        borderBottomLeftRadius: "10px",
        borderBottomRightRadius: "10px",
        willChange: "transform",
        transform: slideAnim.x.interpolate(
          (val) => `translateX(${val * -1}px)`
        ),
      }}
    />
  );
});

const Animated = styled(animated(Flex))`
  top: 0;
  z-index: 999;
`;
const Container = ({ children, logo, style }) => {
  return (
    <Animated
      style={style}
      width="100%"
      justifyContent="center"
      alignItems="center"
    >
      {logo && <Image width="55px" ml="1em" m="auto" src={logo} />}
      {children}
    </Animated>
  );
};
const Nav = ({ logout, isLoggedIn }) => {
  const isMounted = useRef(false);
  const [buttonWidth, setButtonWidth] = useState(100);
  const [isVisible, toggleVisible] = useState(true);
  const [pageIndex, setPageIndex] = useState();
  const containerRef = useRef();
  const location = useLocation();
  const animation = useSpring({
    transform: isVisible ? "translateY(0%)" : "translateY(-100%)",
  });

  const getPageIndex = (currentPath) =>
    pages.map((page) => page.path).indexOf(currentPath.replace("/", "")) + 1;

  useEffect(() => {
    isMounted.current = true;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width / 5;
      setButtonWidth(width);
    }
    return () => {};
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return setPageIndex(5);
    const pgIndex = getPageIndex(location.pathname);
    const i = pgIndex > 0 ? pgIndex : 1;

    setPageIndex(i);
  }, [location.pathname]);

  return (
    <Container style={{ position: "fixed", ...animation }}>
      <div
        ref={containerRef}
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: `repeat(${5},minmax( 0,1fr ))`,
        }}
      >
        <NavButton path={"/Dash"} name={"Dash"} />
        <NavButton path={"/Movies"} name={"Movies"} />
        <NavButton path={"/Music"} name={"Music"} />
        <NavButton path={"/Storage"} name={"Storage"} />
        {isLoggedIn ? (
          <NavButton onClick={logout} path="/" name="Logout" />
        ) : (
          <NavButton path={"Login"} name="Login" />
        )}
        {buttonWidth && pageIndex && (
          <ActiveBackground pageIndex={pageIndex} width={buttonWidth} />
        )}
      </div>
    </Container>
  );
};

export default React.memo(Nav);
