import React, { useState, useEffect } from "react";
import { Route, Switch, Link } from "react-router-dom";
import { Box, Flex, Heading } from "rebass";
import styled from "styled-components";
import gql from "graphql-tag";
import { useAuth } from "../components/auth/index";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useSpring, animated } from "react-spring";

const Container = styled(Flex)``;

const MUTATION_NewService = gql`
  mutation newService($input: serviceInput) {
    newService(input: $input) {
      name
    }
  }
`;

const MUTATION_changeBill = gql`
  mutation changeBill($id: ID, $input: billInput) {
    changeBill(id: $id, input: $input) {
      dueDate
    }
  }
`;
const QUERY_Bills = gql`
  query getBills($token: String, $service: String) {
    getBills(token: $token, service: $service) {
      dueDate
    }
  }
`;

const QUERY_Services = gql`
  query getServices($token: String) {
    getServices(token: $token) {
      name
    }
  }
`;

const AddServiceCard = ({ token }) => {
  const [cycle, setCycle] = useState(null);
  const [startDate, setDate] = useState(null);
  const [name, setName] = useState(null);
  const [addService] = useMutation(MUTATION_NewService);

  const handleSubmit = e => {
    e.preventDefault();
    addService({
      variables: {
        input: { cycle: parseInt(cycle, 10), startDate, name, token }
      }
    });
    reset();
  };

  const reset = () => {
    setCycle(null);
    setDate(null);
    setName(null);
  };

  const handleChange = ({ target }, setter) => {
    setter(target.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", maxWidth: "400px" }}
    >
      Cycle Every
      <input onChange={e => handleChange(e, setCycle)} type="number" />
      Start Date
      <input type="date" onChange={e => handleChange(e, setDate)} />
      Service
      <input type="text" onChange={e => handleChange(e, setName)} />
      <input type="submit" />
    </form>
  );
};

const BillSlider = ({ service, token }) => {
  const [newAmount, setAmount] = useState();

  const { loading, error, data } = useQuery(QUERY_Bills, {
    variables: {
      service,
      token
    }
  });

  // const [changeBill] = useMutation(MUTATION_changeBill);

  const changeBill = e => {
    e.preventDefault();
    // changeBill({variables:{
    //   id:
    //   ,
    //     input:{

    //     }
    // }})
  };

  return loading
    ? null
    : data.getBills.map(({ dueDate, billPayed, pastDue, amount }) => (
        <Flex
          m=".2em"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          style={{ height: "100%", boxShadow: "#312f2f8f 0px 9px 8px 0px" }}
          maxWidth="10%"
          as="form"
          onSubmit={changeBill}
        >
          <Heading fontSize=".8em">{dueDate}</Heading>
          {amount ? (
            amount
          ) : (
            <>
              <input
                onChange={e => setAmount(e.target.value)}
                style={{ maxWidth: "30%" }}
                type="number"
              />
              <input type="submit" />
            </>
          )}
        </Flex>
      ));
};

const ServiceSliders = ({ token }) => {
  const { loading, error, data } = useQuery(QUERY_Services, {
    variables: {
      token
    }
  });

  return loading
    ? null
    : data.getServices.map(({ name }) => (
        <Flex width="100%">
          <Heading p="2em" style={{ flexBasis: "30%" }}>
            {name}
          </Heading>
          <Box bg="beige" p=".3em" style={{ flexBasis: "100%" }}>
            <BillSlider token={token} service={name} />
          </Box>
        </Flex>
      ));
};

const DASH_Utility = () => {
  const [token] = useAuth();

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      bg="grey"
      width="100%"
      height="100%"
    >
      <Flex
        flexDirection="column"
        alignItems="center"
        p="1.5em"
        width="100%"
        bg="#969696"
      >
        <Heading>New Utility Service</Heading>
        <AddServiceCard token={token} />
      </Flex>
      {token && <ServiceSliders token={token} />}
    </Flex>
  );
};

const Nav = () => {
  const inAmin = useSpring({
    from: {
      transform: "translateX(-100%)"
    },
    to: {
      transform: "translateX(0%)"
    }
  });

  const NavLink = styled(Link)`
    text-decoration: none;
    color: black;
    font-family: "Oswald", sans-serif;
    font-size: 2em;
    font-weight: 900;
    width: 100%;
    background-color: #00e4e4;
    /* Animations */
    transition: all 0.6s cubic-bezier(0.455, 0.03, 0.515, 0.955);
    &:hover {
      transform: scale(1.1);
      background-color: black;
      color: white;
    }
  `;

  const NavContainer = animated(styled(Flex)`
    overflow: hidden;
  `);

  return (
    <NavContainer
      alignItems="center"
      justifyContent="spaced-evenly"
      flexBasis="25%"
      bg="#00dcff"
      style={inAmin}
    >
      <NavLink>Utilities</NavLink>
    </NavContainer>
  );
};

export default function Dash() {
  return (
    <Container height="100%">
      <Nav />
      <DASH_Utility />
      {/* <Switch>
        <Route path="" component={DASH_Utility} />
      </Switch> */}
    </Container>
  );
}
