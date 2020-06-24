import moment from "moment";
import Menu from "../menu";
import React, { useState, useEffect } from "react";
import Icon from "../icon";
import { useSpring, animated } from "react-spring";
import {
  QUERY_Bills,
  MUTATION_changeBill,
  MUTATION_removeBill,
} from "./Dash_Graphql";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Heading, Flex, Box } from "rebass";
import styled from "styled-components";
import { DiNginx } from "react-icons/di";
import { GridListTile, Card, Typography, CardContent } from "@material-ui/core";

const TabContaienr = styled.div`
  position: absolute;
  background-color: red;
  top: 0;
  left: 0%;
  color: black;
  font-size: 0.5em;
  padding: 0.2em;
  border-bottom-right-radius: 4px;
`;

const BillContainer = styled(Box)`
  display: flex;
  background: ${({ bgColor }) => bgColor};
  border-radius: 4px;
  color: black;

  input {
    color: black !important;
  }
`;

const PastDueTab = () => <TabContaienr>PastDue</TabContaienr>;

const BillCardMenu = ({ removeBill }) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="space-around"
      flexDirection="column"
      style={{ height: "100%" }}
    >
      <Icon type="exit" onClick={() => removeBill()} />
      <div style={{ height: "1px", background: "white", width: "100%" }} />
      <Icon type="mail" />
    </Flex>
  );
};
export const Bill = ({ pastDue, amount, date }) => {
  // const changeBill = (e, id) => {
  //   e.preventDefault();
  //   setBill({
  //     variables: {
  //       input: {
  //         amount: Number(newAmount),
  //         bill: id,
  //       },
  //     },
  //   }).then(refetch);
  // };
  return (
    <GridListTile>
      <Card>
        <CardContent>
          <Typography variant="h4" style={{ fontSize: "1.4em" }}>
            Due
          </Typography>
          <Typography variant="subtitle2">{date}</Typography>
          <Typography variant="subtitle2">{"$" + Number(amount)} </Typography>
        </CardContent>
      </Card>
      {pastDue && <PastDueTab />}
    </GridListTile>
  );
};
