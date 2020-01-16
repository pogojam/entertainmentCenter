import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Auth } from "../components/auth/index";
import { Nav } from "../components/dash/Dash_Nav";
import { Service } from "../components/dash/Dash_Service";
import { BillCards } from "../components/dash/Dash_Bill";
import { Calendar } from "../components/dash/Dash_Calendar";
import { Box, Flex } from "rebass";

const template = {
  bg: "#5c548a2b",
  secondary: "aqua",
  containerPadding: "1.5em"
};

const PageContainer = styled(Box)`
  display: grid;
  grid-gap: ${template.containerPadding};

  .wrapper {
    border-radius: 4px;
    background: ${template.bg};
  }

  input,
  select,
  textarea {
    color: ${template.secondary};
    border-color: ${template.secondary};
  }
`;

const Utility_Page = ({ role }) => {
  switch (role) {
    case "user":
      return (
        <Service.Slider>
          {service => <BillCards service={service} />}
        </Service.Slider>
      );
    case "admin":
      return (
        <>
          <Service.CreateService />
          <Service.Slider Bills={BillCards} />
        </>
      );
    default:
      return <Box />;
  }
};

const Home_Page = ({ role }) => {
  switch (role) {
    case "user":
      return (
        <>
          <Calendar />
        </>
      );
    case "admin":
      return (
        <>
          <Service.CreateService />
          <Service.Slider Bills={BillCards} />
        </>
      );
    default:
      return <Box />;
  }
};

const Pages = [Utility_Page, Box, Home_Page];

export default function Dash(rest) {
  console.log(rest);
  const [index, setIndex] = useState(0);
  const { User } = Auth.useContainer();

  const Page = Pages[index];

  return (
    <Flex style={{ color: template.secondary }} height="100%">
      <Nav setIndex={setIndex} />
      <PageContainer p="1.5em" width="100%" height="100%">
        <Page role={User.role} />
      </PageContainer>
    </Flex>
  );
}
