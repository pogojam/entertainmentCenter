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
  const { loading, error, data } = useQuery(QUERY_Bills, {
    variables: {
      service,
      token
    }
  });

  return loading
    ? null
    : data.getBills.map(({ dueDate }) => (
        <Box>
          <Heading>{dueDate}</Heading>
        </Box>
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
          <Box bg="beige" style={{ flexBasis: "100%" }}>
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
      <DASH_Utility />
      {/* <Switch>
        <Route path="" component={DASH_Utility} />
      </Switch> */}
    </Container>
  );
}
