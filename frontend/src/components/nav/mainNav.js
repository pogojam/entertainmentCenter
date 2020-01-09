import React, { useState } from "react";
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

const NavButton = ({ name, path, onClick }) => (
  <Link to={path}>
    <StyledButton onClick={onClick} bg="transparent" color="#22ce99" m="1em">
      {name}
    </StyledButton>
  </Link>
);

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

const buildButtons = (pages, handleClick) =>
  pages.map((e, i) => <NavButton key={e.name + i} {...e} />);

const Nav = ({ visible, pages, logout, isLoggedIn }) => {
  const [isVisible, toggleVisible] = useState(visible);

  const animation = useSpring({
    transform: isVisible ? "translateY(0%)" : "translateY(-100%)"
  });

  const buttonList = pages.filter(e => e.name !== "Login");

  return (
    <Container style={{ position: "fixed", ...animation }}>
      {buildButtons(buttonList)}
      {isLoggedIn ? (
        <NavButton onClick={logout} path="/" name="Logout" />
      ) : (
        <NavButton path={"Login"} name="Login" />
      )}
    </Container>
  );
};

export default Nav;
