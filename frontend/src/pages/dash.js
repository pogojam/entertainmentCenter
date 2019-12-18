import React, { useState, useEffect } from "react";
import { Route, Switch, Link } from "react-router-dom";
import { Box, Flex, Heading } from "rebass";
import styled from "styled-components";
import gql from "graphql-tag";
import { useAuth } from "../components/auth/index";
import { useQuery, useMutation } from "@apollo/react-hooks";

const Container = styled(Flex)``;

const MUTATION_NewService = gql`
  mutation newService($input: serviceInput) {
    newService(input: $input) {
      name
    }
  }
`;

const UtilityCard = ({ token }) => {
  const [cycle, setCycle] = useState(null);
  const [startDate, setDate] = useState(null);
  const [name, setName] = useState(null);
  const [addService, { data }] = useMutation(MUTATION_NewService);

  const handleSubmit = e => {
    e.preventDefault();
    addService({
      variables: {
        input: { cycle: parseInt(cycle, 10), startDate, name, token }
      }
    });
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

const DASH_Utility = () => {
  const [token] = useAuth();

  console.log(token);
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      bg="grey"
      width="100%"
      height="100%"
    >
      <Heading>New Utility Service</Heading>
      <UtilityCard token={token} />
    </Flex>
  );
};

const Nav = () => {
  return (
    <Box>
      <Link>Utilities</Link>
    </Box>
  );
};

export default function Dash() {
  return (
    <Container height="100%">
      <Nav />
      <Switch>
        <Route path="/" component={DASH_Utility} />
      </Switch>
    </Container>
  );
}
