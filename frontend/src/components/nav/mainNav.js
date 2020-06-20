import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Flex, Image, Button } from "rebass";
import { useSpring, animated } from "react-spring";

const StyledButton = styled(Button)`
  transition: 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
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

const Container = ({ children, logo, style }) => {
  const Animated = styled(animated(Flex))`
    top: 0;
    z-index: 999;
  `;

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
const ActiveBackground = animated(styled.div`
  background-color: red;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: calc(100% / 5);
  z-index: -1;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`);
const BuildButtons = ({ pages }) =>
  pages.map((e, i) => <NavButton key={e.name + i} {...e} />);

const Nav = React.memo(({ visible, pages, logout, isLoggedIn, user }) => {
  const ActiveBgRef = useRef();
  const location = useLocation();
  const [isVisible, toggleVisible] = useState(false);

  const animation = useSpring({
    transform: isVisible ? "translateY(0%)" : "translateY(-100%)",
  });
  const [slideAnim, setAnimSlide] = useSpring(() => ({
    x: [0],
  }));

  const buttonList = pages.filter((e) => e.name !== "Login");

  const getPageIndex = (currentPath) =>
    pages.map((page) => page.path).indexOf(currentPath.replace("/", "")) + 1;

  useEffect(() => {
    toggleVisible(true);
  }, []);

  useEffect(() => {
    const bgItem = ActiveBgRef.current;
    if (bgItem) {
      const rect = bgItem.getBoundingClientRect();
      const width = rect.width;
      const pgIndex = getPageIndex(location.pathname);
      const i = pgIndex > 0 ? pgIndex : 1;
      console.log(i, location.pathname, rect, pages);
      console.log(width - width * 1);
      setAnimSlide({
        x: [width - width * i],
      });
    }
  }, [location.pathname]);

  console.log(slideAnim);

  return (
    <Container style={{ position: "fixed", ...animation }}>
      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: `repeat(${
            buttonList.length + 1
          },minmax( 0,1fr ))`,
        }}
      >
        <ActiveBackground
          ref={ActiveBgRef}
          style={{
            willChange: "transform",
            transform: slideAnim.x.interpolate(
              (val) => `translateX(${val * -1}px)`
            ),
          }}
        />
        <BuildButtons pages={buttonList} />
        {isLoggedIn ? (
          <NavButton onClick={logout} path="/" name="Logout" />
        ) : (
          <NavButton path={"Login"} name="Login" />
        )}
      </div>
    </Container>
  );
});

export default Nav;
