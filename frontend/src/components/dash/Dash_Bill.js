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
export const BillCard = ({
  admin,
  refetch,
  service,
  dueDate,
  amount,
  paidUsers,
  pastDue,
}) => {
  const date = moment.unix(dueDate._seconds).format("LL");
  const [newAmount, setAmount] = useState();
  const [setBill] = useMutation(MUTATION_changeBill);
  const [removeBill] = useMutation(MUTATION_removeBill);
  const [isPastDue, setDue] = useState(false);
  const billID = service + "_" + date;
  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (!paidUsers.includes(uid) && pastDue === true) {
      setDue(true);
    }
  }, [isPastDue]);

  const changeBill = (e, id) => {
    e.preventDefault();
    setBill({
      variables: {
        input: {
          amount: Number(newAmount),
          bill: id,
        },
      },
    }).then(refetch);
  };
  return (
    <Menu
      side="bottom"
      style={{
        margin: ".2em",
        marginRight: "1vw",
        boxShadow: "rgba(0, 0, 0, 0.59) 0px 3px 9px 1px",
        position: "relative",
        maxWidth: "10%",
        minWidth: "150px",
        height: "unset",
      }}
      drawerItem={() => (
        <BillCardMenu
          removeBill={() =>
            removeBill({
              variables: {
                input: {
                  id: billID,
                },
              },
            }).then(refetch)
          }
        />
      )}
    >
      <BillContainer
        padding=".8em"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        as="form"
        style={{ height: "100%" }}
        onSubmit={(e) => changeBill(e, billID)}
        bgColor={"#9392bf99"}
      >
        <Box color={"black"} fontSize="1rem">
          <Heading style={{ fontSize: "1.4em" }}>Due</Heading>
          <span>{date}</span>
        </Box>
        {amount | !admin ? (
          "$" + (!amount ? 0 : amount)
        ) : (
          <>
            <Heading style={{ fontSize: "14px" }}>Set Amount</Heading>
            <input
              onChange={(e) => setAmount(e.target.value)}
              style={{
                maxWidth: "80%",
                borderColor: "black",
              }}
              type="number"
            />
            <input type="submit" />
          </>
        )}
        {isPastDue && <PastDueTab />}
      </BillContainer>
    </Menu>
  );
};

export const BillCards = ({ service, admin }) => {
  const { loading, error, data, refetch } = useQuery(QUERY_Bills, {
    variables: {
      service,
    },
  });

  return loading
    ? null
    : data.getBills.map((billData, i) => (
        <BillCard key={i} {...billData} refetch={refetch} admin={admin} />
      ));
};
