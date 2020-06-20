import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import styled from "styled-components";
import { Auth } from "../components/auth/index";
import { Nav } from "../components/dash/Dash_Nav";
import { Service } from "../components/dash/Dash_Service";
import { BillCards } from "../components/dash/Dash_Bill";
import { Calendar } from "../components/dash/Dash_Calendar";
import { Box, Flex } from "rebass";
import { Chore } from "../components/dash/Dash_Chore";
import { MdEventAvailable, MdHome, MdSettings } from "react-icons/md";
import { PaymentForm } from "../components/forms/Form_Payment";
import { Template } from "../components/template";

const PageContainer = styled(Box)`
  /* display: grid; */
  grid-gap: ${Template.containerPadding};

  .wrapper {
    border-radius: 4px;
    background: ${Template.bg};
    box-sizing: border-box;
    max-width: 100%;
  }

  input,
  select,
  textarea {
    color: ${Template.secondary};
    border-color: ${Template.secondary};
  }
`;

const Utility_Page = {
  title: "Utilites",
  icon: MdEventAvailable,
  content: ({ role }) => {
    switch (role) {
      case "user":
        return (
          <Service.Fetch>
            {(data) => (
              <Service.Slider data={data}>
                {(service) => <BillCards service={service} />}
              </Service.Slider>
            )}
          </Service.Fetch>
        );
      case "admin":
        return (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "500px 1fr",
              gridTemplateRows: "repeat(auto-fill,minmax(0,1fr))",
              gridGap: "1em",
            }}
          >
            <Service.Fetch>
              {(data, refetch) => (
                <>
                  <Service.CreateService refetch={refetch} />
                  <Service.Slider refetch={refetch} admin data={data}>
                    {(service) => <BillCards admin service={service} />}
                  </Service.Slider>
                </>
              )}
            </Service.Fetch>
          </div>
        );
      default:
        return <Box />;
    }
  },
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
            <Calendar />
            <Chore.Preview />
          </>
        );
      default:
        return <Box />;
    }
  },
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
            <PaymentForm.Subscribe />
          </>
        );
      default:
        return <Box />;
    }
  },
};

const Pages = [Utility_Page, Home_Page, Account_Page];

export default function Dash(rest) {
  const navRef = useRef();
  const [navHeight, setHeight] = useState();
  const [index, setIndex] = useState(0);
  const Page = Pages[index].content;
  useEffect(() => {
    if (navRef.current) {
      console.log(navRef);

      setHeight(navRef.current.getBoundingClientRect().height);
    }
  }, [navRef.current]);

  return (
    <Flex style={{ color: Template.secondary, flexDirection: "column" }}>
      <Nav ref={navRef} Pages={Pages} activeIndex={index} setIndex={setIndex} />
      <PageContainer
        style={{ ...Pages[index].layoutStyle, tranistion: "width .3s linear" }}
        p="1.5em"
        mt={navHeight ? navHeight : "1em"}
        height="100%"
        width="100%"
      >
        <Page role={"admin"} />
      </PageContainer>
    </Flex>
  );
}
