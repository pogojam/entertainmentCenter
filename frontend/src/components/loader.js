import React from "react";
import styled, { keyframes } from "styled-components";

const ripple = keyframes` 
  from {
    transform: scale(0);
    opacity: 1;
  }

  to {
    transform: scale(1);
    opacity: 0;
  }
`;

const LoaderContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  align-items: center;
  justify-content: center;

  .ripple {
    width: 4rem;
    height: 4rem;
    margin: 2rem;
    border-radius: 50%;
    border: 0.3rem solid white;
    transform: translate(50%);
    animation: 1s ${ripple} ease-out infinite;
  }
`;

const Loader = () => (
  <LoaderContainer>
    <div className="ripple"></div>
  </LoaderContainer>
);

export default Loader;
