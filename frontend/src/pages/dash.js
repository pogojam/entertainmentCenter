import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Auth } from "../components/auth/index";
import { Nav } from "../components/dash/Dash_Nav";
import { Service } from "../components/dash/Dash_Service";
import { BillCards } from "../components/dash/Dash_Bill";
import { Calendar } from "../components/dash/Dash_Calendar";
import { Box, Flex } from "rebass";
import { Chore } from "../components/dash/Dash_Chore";
import {
  MdEventAvailable,
  MdPerson,
  MdAccountBalance,
  MdHome,
  MdSettings
} from "react-icons/md";
import { PaymentForm } from "../components/forms/Form_Payment";

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
    padding: 1.5em;
  }

  input,
  select,
  textarea {
    color: ${template.secondary};
    border-color: ${template.secondary};
  }
`;

const Utility_Page = {
  title: "Utilites",
  icon: MdEventAvailable,
  content: ({ role }) => {
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
  }
};

const Home_Page = {
  title: "Home",
  icon: MdHome,
  content: ({ role }) => {
    switch (role) {
      case "user":
        return (
          <>
            <Calendar />
            <Chore.Preview />
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
  }
};

const Account_Page = {
  title: "Account",
  icon: MdSettings,
  content: ({ role }) => {
    switch (role) {
      case "user":
        return (
          <>
            <PaymentForm.Subscribe />
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
  }
};

const Pages = [Utility_Page, Home_Page, Account_Page];

export default function Dash(rest) {
  const [index, setIndex] = useState(0);
  const { User } = Auth.useContainer();

  const Page = Pages[index].content;

  return (
    <Flex style={{ color: template.secondary }} height="100%">
      <Nav Pages={Pages} activeIndex={index} setIndex={setIndex} />
      <PageContainer
        style={Pages[index].layoutStyle}
        p="1.5em"
        width="100%"
        height="100%"
      >
        <Page role={User.role} />
      </PageContainer>
    </Flex>
  );
}
