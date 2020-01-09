import React, { useState, useEffect } from "react";
import { Route, Switch, Link, useRouteMatch } from "react-router-dom";
import { Box, Flex, Heading } from "rebass";
import styled from "styled-components";
import gql from "graphql-tag";
import { useAuth } from "../components/auth/index";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useSpring, animated } from "react-spring";
import {
  MdEventAvailable,
  MdPerson,
  MdAccountBalance,
  MdDelete,
  MdYoutubeSearchedFor,
  MdSubscriptions
} from "react-icons/md";

const Container = styled(Flex)``;

const MUTATION_NewService = gql`
  mutation newService($input: serviceInput) {
    newService(input: $input) {
      name
    }
  }
`;

const MUTATION_changeBill = gql`
  mutation changeBill($token: String, $input: billInput) {
    changeBill(token: $token, input: $input) {
      amount
    }
  }
`;

const MUTATION_removeService = gql`
  mutation newService($input: serviceInput) {
    removeService(input: $input) {
      name
    }
  }
`;

const QUERY_Bills = gql`
  query getBills($token: String, $service: String) {
    getBills(token: $token, service: $service) {
      dueDate
      id
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

const template = {
  bg: "#5c548a2b",
  secondary: "aqua",
  containerPadding: "1.5em"
};

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
      },
      refetchQueries: ["getServices"]
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

  const [setBill] = useMutation(MUTATION_changeBill);

  const changeBill = e => {
    e.preventDefault();
    console.log(data);
    setBill({
      variables: {
        token,
        input: {
          amount: newAmount,
          id: data.id
        }
      }
    });
  };

  return loading
    ? null
    : data.getBills.map(({ dueDate, billPayed, pastDue, amount }) => (
        <Flex
          m=".2em"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          style={{ boxShadow: "rgba(0, 0, 0, 0.59) 0px 3px 9px 1px" }}
          maxWidth="10%"
          minWidth="70px"
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
                style={{ maxWidth: "80%" }}
                type="number"
              />
              <input type="submit" />
            </>
          )}
        </Flex>
      ));
};

const MenuContainer = styled(Box)`
  margin-left: auto;
  .bar {
    width: 2em;
    height: 2px;
    background-color: #1a927c;
    margin: 5px 0;
  }
`;

const OptionsButton = ({ onClick }) => {
  const [state, setState] = useState(false);

  return (
    <>
      <MenuContainer onClick={() => setState(!state)}>
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
          transform: state ? "translateX(0%)" : "translateX(100%)"
        }}
        onClick={onClick}
      >
        delete <MdDelete />
      </Box>
    </>
  );
};

const ServiceSliders = ({ token }) => {
  const { loading, error, data } = useQuery(QUERY_Services, {
    variables: {
      token
    }
  });

  const [mutation] = useMutation(MUTATION_removeService);

  const removeService = name => {
    console.log(name);
    mutation({
      variables: {
        input: {
          token,
          name
        }
      },
      refetchQueries: ["getServices"]
    });
  };

  return loading
    ? null
    : data.getServices.map(({ name }) => (
        <Flex
          className="wrapper"
          flexDirection="column"
          style={{ overflow: "hidden", position: "relative" }}
          p={"1.5em"}
          width="100%"
        >
          <Flex>
            <Heading fontSize=".8em">{name}</Heading>
            <OptionsButton onClick={() => removeService(name)} />
          </Flex>
          <Flex p=".3em" style={{ flexBasis: "100%" }}>
            <BillSlider token={token} service={name} />
          </Flex>
        </Flex>
      ));
};

const DASH_Utility = () => {
  const [token] = useAuth();

  const DashContainer = styled(Box)`
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

  return (
    <DashContainer p="1.5em" width="100%" height="100%">
      <Flex
        className="wrapper"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-around"
        p={template.containerPadding}
      >
        <Heading>New Utility Service</Heading>
        <AddServiceCard token={token} />
      </Flex>
      {token && <ServiceSliders token={token} />}
    </DashContainer>
  );
};

const Nav = ({ setIndex }) => {
  let { path, url } = useRouteMatch();
  const inAmin = useSpring({
    from: {
      transform: "translateX(-100%)"
    },
    to: {
      transform: "translateX(0%)"
    }
  });

  const NavLink = styled(Box)`
    text-decoration: none;
    font-family: "Oswald", sans-serif;
    font-size: 1em;
    font-weight: 900;
    color: ${template.secondary};
    padding: 1em;
    display: flex;

    svg {
      margin-right: 0.5em;
    }

    /* Animations */
    transition: all 0.6s cubic-bezier(0.455, 0.03, 0.515, 0.955);
    &:hover {
      background-color: #090b0c69;
    }
  `;

  const NavContainer = animated(styled(Flex)`
    display: flex;
    flex-direction: column;
    padding: ${template.containerPadding};
    padding-right: 0;
    .wrapper {
      background: ${template.bg};
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      margin-bottom: 1em;
      border-radius: 4px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    overflow: hidden;
  `);

  return (
    <NavContainer
      alignItems="center"
      justifyContent="spaced-evenly"
      flexBasis="25%"
      style={inAmin}
    >
      <Flex
        justifyContent="center"
        alignItems="center"
        maxHeight="10em"
        className="wrapper"
      >
        <MdAccountBalance size="3.5em" />
      </Flex>

      <Box pt="3em" className="wrapper">
        <NavLink onClick={() => setIndex(0)}>
          <MdEventAvailable />
          Utilities
        </NavLink>
        <NavLink onClick={() => setIndex(1)}>
          <MdPerson />
          Roomate
        </NavLink>
      </Box>
    </NavContainer>
  );
};
const Pages = [DASH_Utility, Box];

export default function Dash() {
  let { path, url } = useRouteMatch();
  const [index, setIndex] = useState(0);
  const subscriptions = [];
  const subscribeRefetch = sub => {
    subscriptions.push(sub);
  };
  const Page = Pages[index];

  useEffect(() => {
    subscriptions.forEach(sub=>sub.)
  }, [index])
  return (
    <Container style={{ color: template.secondary }} height="100%">
      <Nav setIndex={setIndex} />
      <Page />
    </Container>
  );
}
