import React, { useRef, useEffect } from "react";
import { useToggle } from "../util";
import Icon from "./icon";
import styled from "styled-components";
import { useSize } from "../util";
import { useSpring, animated } from "react-spring";
import { Card } from "@material-ui/core";

const MenuContainer = styled(Card)`
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
  .Menu_Icon_Container {
    background-color: #b566ff;
  }
`;

const animation = {
  bottom: (showMenu, size, tabBarPeek) => ({
    transform: `translateY(${
      showMenu ? `0%` : `${size.height ? size.height - tabBarPeek : 2000}px`
    })`,
    flexDirection: "column",
  }),
  right: (showMenu, size, tabBarPeek) => ({
    transform: `translateX(${
      showMenu ? `0%` : `${size.width ? size.width - tabBarPeek : 2000}px`
    })`,
  }),
  left: (showMenu, size, tabBarPeek) => ({
    transform: `translateX(${
      showMenu ? `0%` : `${size.width ? -size.width + tabBarPeek : -2000}px`
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

const Menu = React.memo(
  ({
    drawerItem: Drawer,
    tabBarPeek = 19,
    toggleMenu: toggleMenuExternal,
    menuStatus: toggleMenuExternalStatus,
    children,
    side,
    className,
    mouseLeave,
    invert,
    ...props
  }) => {
    const ref = useRef();
    const mounted = useRef(false);
    const size = useSize(ref);
    const [toggleStatus, toggle] = useToggle(false);
    const showMenu =
      typeof toggleMenuExternalStatus !== "undefined"
        ? toggleMenuExternalStatus
        : toggleStatus;

    const anim = useSpring(
      side
        ? animation[side](showMenu, size, tabBarPeek)
        : animation.bottom(showMenu, size, tabBarPeek)
    );
    useEffect(() => {
      console.log(side);
      mounted.current = true;
      return () => (mounted.current = false);
    }, []);

    return (
      <MenuContainer
        onMouseLeave={mouseLeave && mouseLeave}
        className="Menu_Container"
        {...props}
      >
        {children}
        <animated.div ref={ref} className="Slide" style={anim}>
          <div
            className="Menu_Icon_Container"
            onClick={() => {
              if (toggleMenuExternal) {
                toggleMenuExternal();
              } else {
                toggle();
              }
            }}
            style={{
              ...styles[side].container,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {showMenu ? (
              <Icon
                className="Menu_Icon Icon"
                style={styles[side].icon}
                type="drag"
              />
            ) : (
              <Icon
                className="Menu_Icon Icon"
                style={styles[side].icon}
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
      </MenuContainer>
    );
  }
);

export default Menu;
