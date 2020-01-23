import React from "react";
import styled from "styled-components";
import { Box, Button } from "rebass";
import { Elements, injectStripe, CardElement } from "react-stripe-elements";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Auth } from "../auth/index";

const MUTATION_creatSubscription = gql`
  mutation createSubscription($token: String) {
    createSubscription(token: $token) {
      autoPay
    }
  }
`;

// const StripeElement = styled(CardElement)`
//   color: aqua;
//   background-color: #0000007a;
//   padding: 15px;
//   border-radius: 4px;
// `;

const CardElementStyles = {
  base: {
    color: "#00ffff",
    fontSize: "15px",
    padding: "15px",
    background: "#0000007a",
    iconColor: "aqua",
    empty: {
      color: "#00ffff"
    }
  }
};

const SubscribeContainer = styled(Box)`
  display: grid;
  grid-template-rows: 3em 1fr;
  grid-gap: 20px;
  max-height: 40vw;

  .StripeElement {
    background-color: #0000007a;
    padding: 0.375rem 0.75rem;
    border-radius: 4px;
  }

  fieldset {
    background-color: #0000007a;
    display: flex;
    padding: 15px;
    font-size: 0;
    border-radius: 4px;
    border: none;

    label {
      display: flex;
      font-size: 15px;
      padding: 15px 0;
    }
    span {
      min-width: 100px;
      text-align: left;
      padding: 0 15px;
    }

    input:-internal-autofill-selected {
      background-color: transparent;
      color: transparent;
    }

    input {
      flex: 1;
      padding: 0 15px;
      border: 0px;
      border-bottom: 1px solid aqua;
    }
  }
`;

const Subscribe = ({ stripe, User }) => {
  const [mutation] = useMutation(MUTATION_creatSubscription);

  const handleSubmit = async e => {
    e.preventDefault();
    try{
    const { token } = await stripe.createToken();
    console.log(token)
      mutation({
        variables: {
          token: token.id
        }
      });
    }catch(err){
      console.log(err)
    }
  };

  return !User.autoPay ? (
    <SubscribeContainer className="wrapper">
      Subscribe for automatic payments
      <fieldset>
        <label>
          <span>FirstName</span>
          <input name="FirstName" type="text" />
        </label>
        <label>
          <span>LasttName</span>
          <input name="LasttName" type="text" />
        </label>
        <label>
          <span>Address</span>
          <input name="Address" type="text" />
        </label>
        <label>
          <span>City</span>
          <input name="City" type="text" />
        </label>
      </fieldset>
      <CardElement color="aqua" style={CardElementStyles} />
      <Button color="aqua" bg="black" onClick={handleSubmit}>
        Subscribe
      </Button>
    </SubscribeContainer>
  ) : (
    <Box>
      <h1>Your Setup for auto pay</h1>
    </Box>
  );
};

const StripeFormtWrap = Component => () => {
  const { User } = Auth.useContainer();
  return (
    <Elements>
      <Component User={User} />
    </Elements>
  );
};

export const PaymentForm = {
  Subscribe: StripeFormtWrap(injectStripe(Subscribe))
};
