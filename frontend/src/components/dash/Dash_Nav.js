import React from "react";
import styled from "styled-components";
import { useSpring, animated } from "react-spring";
import { MdEventAvailable, MdPerson, MdAccountBalance } from "react-icons/md";
import { Box, Flex } from "rebass";
import { template } from "./Dash_Template";

export const Nav = ({ setIndex }) => {
  const inAmin = useSpring({
    from: {
      transform: "translateX(-100%)"
    },
    to: {
      transform: "translateX(0%)"
    }
  });

  const NavLink = styled(Box)`
    text-decoration: none;
    font-family: "Oswald", sans-serif;
    font-size: 1em;
    font-weight: 900;
    color: ${template.secondary};
    padding: 1em;
    display: flex;

    svg {
      margin-right: 0.5em;
    }

    /* Animations */
    transition: all 0.6s cubic-bezier(0.455, 0.03, 0.515, 0.955);
    &:hover {
      background-color: #090b0c69;
    }
  `;

  const NavContainer = animated(styled(Flex)`
    display: flex;
    flex-direction: column;
    padding: ${template.containerPadding};
    padding-right: 0;
    .wrapper {
      background: ${template.bg};
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      margin-bottom: 1em;
      border-radius: 4px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    overflow: hidden;
  `);

  return (
    <NavContainer
      alignItems="center"
      justifyContent="spaced-evenly"
      flexBasis="25%"
      style={inAmin}
    >
      <Flex
        justifyContent="center"
        alignItems="center"
        maxHeight="10em"
        className="wrapper"
      >
        <MdAccountBalance size="3.5em" />
      </Flex>

      <Box pt="3em" className="wrapper">
        <NavLink onClick={() => setIndex(0)}>
          <MdEventAvailable />
          Utilities
        </NavLink>
        <NavLink onClick={() => setIndex(1)}>
          <MdPerson />
          Roomate
        </NavLink>
        <NavLink onClick={() => setIndex(2)}>
          <MdPerson />
          Home
        </NavLink>
      </Box>
    </NavContainer>
  );
};
