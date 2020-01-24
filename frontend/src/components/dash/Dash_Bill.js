import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import { QUERY_Bills, MUTATION_changeBill } from "./Dash_Graphql";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Heading, Flex, Box } from "rebass";
import styled from "styled-components";

const TabContaienr = styled.div`
  position: absolute;
  background-color: red;
  left: 50%;
  transform: translateX(-50%);
  bottom: -20px;
  color: black;
  font-size: 0.5em;
  padding: 0.2em;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
`;

const PastDueTab = () => <TabContaienr>PastDue</TabContaienr>;

export const BillCard = ({
  admin,
  refetch,
  service,
  dueDate,
  amount,
  paidUsers
}) => {
  const [newAmount, setAmount] = useState();
  const [setBill] = useMutation(MUTATION_changeBill);
  const [isPastDue, setDue] = useState(true);

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (paidUsers.includes(uid)) {
      setDue(false);
    }
  }, []);

  const changeBill = (e, id) => {
    e.preventDefault();
    setBill({
      variables: {
        input: {
          amount: Number(newAmount),
          bill: id
        }
      }
    }).then(refetch);
  };

  return (
    <Flex
      m=".2em"
      ml="1vw"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      style={{
        boxShadow: "rgba(0, 0, 0, 0.59) 0px 3px 9px 1px",
        position: "relative"
      }}
      maxWidth="10%"
      minWidth="70px"
      as="form"
      onSubmit={e => changeBill(e, service + "_" + dueDate)}
    >
      <Heading fontSize=".8em">{dueDate}</Heading>
      {amount | !admin ? (
        "$" + (!amount ? 0 : amount)
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
      {isPastDue && <PastDueTab />}
    </Flex>
  );
};

export const BillCards = ({ service, admin }) => {
  const { loading, error, data, refetch } = useQuery(QUERY_Bills, {
    variables: {
      service
    }
  });

  return loading
    ? null
    : data.getBills.map((billData, i) => (
        <BillCard key={i} {...billData} refetch={refetch} admin={admin} />
      ));
};
