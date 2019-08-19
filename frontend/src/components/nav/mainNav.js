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

const NavButton = ({ name, path }) => (
  <Link to={path}>
    <StyledButton bg="transparent" color="#22ce99" m="1em">
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

const Nav = ({ visible, pages }) => {
  const [isVisible, toggleVisible] = useState(visible);

  const animation = useSpring({
    transform: isVisible ? "translateY(0%)" : "translateY(-100%)"
  });

  return <Container style={animation}>{buildButtons(pages)}</Container>;
};

export default Nav;
