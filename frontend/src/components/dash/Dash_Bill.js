import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { QUERY_Bills, MUTATION_changeBill } from "./Dash_Graphql";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Heading, Flex } from "rebass";

export const BillCards = ({ service, admin }) => {
  const [newAmount, setAmount] = useState();

  const { loading, error, data, refetch } = useQuery(QUERY_Bills, {
    variables: {
      service
    }
  });

  const [setBill] = useMutation(MUTATION_changeBill);

  const changeBill = (e, id) => {
    e.preventDefault();
    setBill({
      variables: {
        input: {
          amount: Number(newAmount),
          service: id
        }
      }
    }).then(refetch);
  };

  return loading
    ? null
    : data.getBills.map(
        ({ dueDate, service, billPayed, pastDue, amount }, i) => (
          <Flex
            key={i}
            m=".2em"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            style={{ boxShadow: "rgba(0, 0, 0, 0.59) 0px 3px 9px 1px" }}
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
          </Flex>
        )
      );
};
