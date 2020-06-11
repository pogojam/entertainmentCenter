import React, { useState } from "react";
import styled from "styled-components";
import { useSpring, animated } from "react-spring";
import {
  MdEventAvailable,
  MdPerson,
  MdAccountBalance,
  MdHome,
} from "react-icons/md";
import { Box, Flex } from "rebass";
import { template } from "./Dash_Template";
import { BurgerButton } from "./Dash_Buttons";

const LinkContainer = styled(Box)`
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
  position: relative;
  display: flex;
  /* padding-top: ${template.containerPadding}; */
  padding-right: 0;
  min-width: 250px;
  z-index: 1;

  .Dash_Nav_BurgerButton {
    pointer-events: none;
    opacity: 0;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

    transform: translateX(0%) !important ;

  /* @media screen and (max-width: 800px) {
    background-color: black;
    padding-top: 4em;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;

    .wrapper {
      background: transparent;
    }

    .Dash_Nav_BurgerButton {
      padding: 1em;
      pointer-events: all;
      opacity: 1;
    }
  } */
  .wrapper {
    background: ${template.bg};
    display: flex;
    width: 100%;
    margin-bottom: 1em;
    border-radius: 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  overflow: hidden;
`);

const Link = ({ isActive, index, navigatePage, Icon, title }) => (
  <LinkContainer
    bg={isActive && "#090b0c69"}
    isActive={isActive}
    onClick={() => navigatePage(index)}
  >
    <Icon />
    {title}
  </LinkContainer>
);

export const Nav = ({ Pages, activeIndex, setIndex }) => {
  const [isActive, setStatus] = useState(false);

  const inAmin = useSpring(
    isActive
      ? {
          transform: "translateX(0%)",
        }
      : {
          transform: "translateX(-75%)",
        }
  );

  return (
    <NavContainer
      isActive={isActive}
      alignItems="center"
      justifyContent="spaced-evenly"
      style={inAmin}
    >
      {/* <BurgerButton
        onClick={() => setStatus(!isActive)}
        className="Dash_Nav_BurgerButton"
      /> */}
      {/* <Flex
        justifyContent="center"
        alignItems="center"
        maxHeight="10em"
        className="wrapper"
      >
        <MdAccountBalance size="3.5em" />
      </Flex> */}

      <Box style={{ justifyContent: "flex-end" }} className="wrapper">
        {Pages.map(({ title, icon }, i) => (
          <Link
            isActive={activeIndex === i}
            title={title}
            Icon={icon}
            navigatePage={setIndex}
            index={i}
            key={i}
          />
        ))}
      </Box>
    </NavContainer>
  );
};
