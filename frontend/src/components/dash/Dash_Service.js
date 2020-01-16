import React, { useState, Children } from "react";
import styled from "styled-components";
import { useSpring, animated } from "react-spring";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Heading, Flex } from "rebass";
import { OptionsButton } from "./Dash_Buttons";
import {
  QUERY_Services,
  MUTATION_removeService,
  MUTATION_NewService
} from "./Dash_Graphql";
import { template } from "./Dash_Template";

const AddServiceForm = () => {
  const [cycle, setCycle] = useState(null);
  const [startDate, setDate] = useState(null);
  const [name, setName] = useState(null);
  const [addService] = useMutation(MUTATION_NewService);

  const handleSubmit = e => {
    e.preventDefault();
    addService({
      variables: {
        input: { cycle: parseInt(cycle, 10), startDate, name }
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

const CreateService = () => (
  <Flex
    className="wrapper"
    flexDirection="column"
    alignItems="center"
    justifyContent="space-around"
    p={template.containerPadding}
  >
    <Heading>New Utility Service</Heading>
    <AddServiceForm />
  </Flex>
);

const Slider = ({ children, admin }) => {
  const { loading, error, data } = useQuery(QUERY_Services);
  const [mutation] = useMutation(MUTATION_removeService);

  const removeService = name => {
    mutation({
      variables: {
        input: {
          name
        }
      },
      refetchQueries: ["getServices"]
    });
  };

  return loading
    ? null
    : data.getServices.map(({ name }, i) => (
        <Flex
          key={i}
          className="wrapper"
          flexDirection="column"
          style={{ overflow: "hidden", position: "relative" }}
          p={"1.5em"}
          width="100%"
        >
          <Flex>
            <Heading fontSize=".8em">{name}</Heading>
            {admin && <OptionsButton onClick={() => removeService(name)} />}
          </Flex>
          <Flex p=".3em" style={{ flexBasis: "100%" }}>
            {children && children(name)}
          </Flex>
        </Flex>
      ));
};

export const Service = {
  CreateService,
  Slider
};
