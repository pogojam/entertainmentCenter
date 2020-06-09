import React, { useRef } from "react";
import { useToggle } from "../util";
import Icon from "./icon";
import styled from "styled-components";
import { useSize } from "../util";
import { useSpring, animated } from "react-spring";

const Menu_Container = styled.div`
  position: relative;
  overflow: hidden;

  .Icon {
    height: 20px;
    width: 15px;
  }
  .Slide {
    background: black;
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    display: flex;
    flex-direction: ${({ side }) =>
      side === "bottom" || (side === "top" && "column")};
    align-items: center;
    max-width: 100%;
  }
`;

const animation = {
  bottom: (showMenu, size) => ({
    transform: `translateY(${
      showMenu ? `0%` : `${size.height ? size.height - 19 : 2000}px`
    })`,
    flexDirection: "column",
  }),
  right: (showMenu, size) => ({
    transform: `translateX(${
      showMenu ? `0%` : `${size.width ? size.width - 19 : 2000}px`
    })`,
  }),
  left: (showMenu, size) => ({
    transform: `translateX(${
      showMenu ? `0%` : `${size.width ? -size.width + 19 : -2000}px`
    })`,
    flexDirection: "row-reverse",
  }),
};

const styles = {
  bottom: {
    container: {
      width: "100%",
      height: "20px",
    },
    icon: {},
  },
  right: {
    container: {
      width: "20px",
      height: "100%",
    },
    icon: {
      transform: "rotate(90deg)",
    },
  },
  left: {
    container: {
      width: "20px",
      height: "100%",
      // flexDirection: "row-reverse",
    },
    icon: {
      transform: "rotate(90deg)",
    },
  },
};

const Menu = ({
  drawerItem: Drawer,
  children,
  side,
  className,
  mouseLeave,
  invert,
  ...props
}) => {
  const ref = useRef();
  const size = useSize(ref);
  const [showMenu, toggle] = useToggle(false);
  const anim = useSpring(
    side ? animation[side](showMenu, size) : animation.bottom(showMenu, size)
  );
  return (
    <Menu_Container
      onMouseLeave={mouseLeave && mouseLeave}
      className="Menu_Container"
      {...props}
    >
      {children}
      <animated.div ref={ref} className="Slide" style={anim}>
        <div
          className="Menu_Icon_Container"
          onClick={toggle}
          style={{
            ...styles[side].container,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {showMenu ? (
            <Icon
              className="Menu_Icon"
              style={styles[side].icon}
              className="Icon"
              type="drag"
            />
          ) : (
            <Icon
              className="Menu_Icon"
              style={styles[side].icon}
              className="Icon"
              type="drag"
            />
          )}
        </div>
        <div
          style={{
            opacity: showMenu ? 1 : 0,
            transition: "opacity .8s linear",
            width: "100%",
            height: "100%",
          }}
        >
          <Drawer />
        </div>
      </animated.div>
    </Menu_Container>
  );
};

export default Menu;
