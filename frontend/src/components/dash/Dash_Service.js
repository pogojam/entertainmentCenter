import Icon from "../icon";
import React, { useState, Children } from "react";
import Loader from "../loader";
import Menu from "../menu";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Heading, Flex } from "rebass";
import { OptionsButton } from "./Dash_Buttons";
import {
  QUERY_Services,
  MUTATION_removeService,
  MUTATION_NewService,
} from "./Dash_Graphql";
import { Template } from "../template";
import styled from "styled-components";

const ServiceContainer = styled.div`
  input::-webkit-calendar-picker-indicator {
    background-color: aqua;
  }
  input {
    color: aqua;
    width: 100%;
  }
  position: relative;
  .Service_Heading {
    padding: 10px;
    @media (max-width: 600) {
      position: absolute;
      top: 10px;
      left: 10px;
    }
  }
  .Menu_Container {
    height: 100%;
  }
  .Slide {
    background-color: "black";
  }
  form {
    padding: 1em;
    border-radius: 3px;
    grid-gap: 30px;
  }
`;

const AddServiceForm = ({ refetch }) => {
  const [cycle, setCycle] = useState(null);
  const [startDate, setDate] = useState(null);
  const [name, setName] = useState(null);
  const [addService] = useMutation(MUTATION_NewService);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addService({
      variables: {
        input: { cycle: parseInt(cycle, 10), startDate, name },
      },
    });
    await refetch();
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
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
        alignItems: "center",
        width: "50%",
        height: "100%",
      }}
    >
      <span>
        Cycle Every
        <input
          style={{ textAlign: "center" }}
          placeholder="In days"
          onChange={(e) => handleChange(e, setCycle)}
          type="number"
        />
      </span>
      <span>
        Start Date
        <input type="date" onChange={(e) => handleChange(e, setDate)} />
      </span>
      <span>
        Service
        <input
          type="text"
          style={{ textAlign: "center" }}
          placeholder="Service Name"
          onChange={(e) => handleChange(e, setName)}
        />
      </span>
      <input
        style={{
          position: "absolute",
          maxWidth: "200px",
          right: "15px",
          bottom: "15px",
        }}
        type="submit"
      />
    </form>
  );
};

const CreateService = ({ refetch }) => (
  <ServiceContainer
    className="wrapper"
    style={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
    alignItems="center"
    justifyContent="space-around"
    p={Template.containerPadding}
  >
    <Heading
      style={{ textAlign: "left" }}
      className="Service_Heading"
      fontSize=".8em"
    >
      New Utility Service
    </Heading>
    <AddServiceForm refetch={refetch} />
  </ServiceContainer>
);
const ServiceMenu = ({ refetch, name }) => {
  return (
    <div>
      <Icon type="exit" />
    </div>
  );
};

const Fetch = ({ children }) => {
  const { loading, error, data, refetch } = useQuery(QUERY_Services);
  console.log(data);
  return !loading ? children(data, refetch) : <Loader />;
};

const Slider = ({ refetch, children, admin, data }) => {
  const [mutation] = useMutation(MUTATION_removeService);

  const removeService = (name) => {
    mutation({
      variables: {
        input: {
          name,
        },
      },
      refetchQueries: ["getServices"],
    });
  };
  if (!data) return <Loader />;
  return data.getServices.map(({ name }, i) => (
    <ServiceContainer
      key={i}
      className="wrapper"
      flexDirection="column"
      style={{ overflow: "hidden", position: "relative" }}
      width="100%"
    >
      <Menu
        side="right"
        drawerItem={() => <ServiceMenu name={name} refetch={refetch} />}
      >
        <Flex className="Service_Heading">
          <Heading fontSize=".8em">{name}</Heading>
        </Flex>
        <Flex
          p=".3em"
          style={{
            alignItems: "center",
            height: "100%",
            fontSize: "1.24vw",
          }}
        >
          <Flex
            style={{
              width: "100%",
            }}
          >
            {children && children(name)}
          </Flex>
        </Flex>
      </Menu>
    </ServiceContainer>
  ));
};

export const Service = {
  CreateService,
  Slider,
  Fetch,
};
