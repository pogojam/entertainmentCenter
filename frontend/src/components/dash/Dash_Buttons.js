import React, { useState } from "react";
import styled from "styled-components";
import { useSpring, animated } from "react-spring";
import { MdDelete } from "react-icons/md";
import { Box } from "rebass";
import { template } from "./Dash_Template";

const MenuContainer = styled(Box)`
  margin-left: auto;
  .bar {
    width: 2em;
    height: 2px;
    background-color: #1a927c;
    margin: 5px 0;
  }
`;

export const OptionsButton = ({ onClick }) => {
  const [isActive, toggle] = useState(false);

  return (
    <>
      <MenuContainer onClick={() => toggle(!isActive)}>
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
      </MenuContainer>
      <Box
        p=".5em"
        bg="black"
        style={{
          borderRadius: "4px",
          position: "absolute",
          bottom: 0,
          right: 0,
          transition: ".5s linear",
          transform: isActive ? "translateX(0%)" : "translateX(100%)"
        }}
        onClick={onClick}
      >
        delete <MdDelete />
      </Box>
    </>
  );
};
