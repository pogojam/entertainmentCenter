import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import AuthStore from "../components/state/stores/Auth_Store";
import { Box, Heading, Flex, Button } from "rebass";
import { toJS } from "mobx";
const Input = styled.input``;

const InputBox = styled(Box)`
  & > * {
    margin: 1em;
    padding: 1em;
  }
`;

const Login = ({ initalState = true, location }) => {
  const [isLoginForm, setFormState] = useState(initalState);

  const { createUser, loginUser, isLoggedIn } = AuthStore;
  const User = toJS(AuthStore.user);

  //Form Controlled State
  const [err, setErr] = useState(null);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [code, setCode] = useState("");

  return (
    <Flex
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          isLoginForm
            ? loginUser({ email, pass })
            : createUser({ email, pass, firstName, lastName, code });
          location.pathname = "/Dash";
        } catch (err) {
          setErr(err);
        }
      }}
      justifyContent="center"
      alignItems="center"
      style={{ height: "100%", width: "100%" }}
    >
      <Box
        minWidth="40%"
        style={{ maxWidth: "400px" }}
        bg="#22ce99"
        as="form"
        p="2em"
      >
        <Heading>{isLoginForm ? "login" : "Signup"}</Heading>
        <InputBox
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            height: "100%",
          }}
        >
          <Input
            onChange={({ target }) => {
              setEmail(target.value);
            }}
            name="email"
            type="email"
          />
          <Input
            onChange={({ target }) => {
              setPass(target.value);
            }}
            name="password"
            type="password"
          />
          {!isLoginForm && (
            <>
              <Input
                onChange={({ target }) => {
                  setFirst(target.value);
                }}
                placeholder="First Name"
                name="firstName"
                type="name"
              />
              <Input
                onChange={({ target }) => {
                  setLast(target.value);
                }}
                placeholder="Last Name"
                name="lastName"
                type="name"
              />
              <Input
                onChange={({ target }) => {
                  setCode(target.value);
                }}
                placeholder="Code"
                name="code"
              />
            </>
          )}

          <Input type="submit" value={isLoginForm ? "Login" : "Submit"} />
          {isLoginForm && (
            <Button
              onClick={() => {
                setFormState(!isLoginForm);
              }}
              bg="black"
            >
              Sign up
            </Button>
          )}
        </InputBox>
        {err && <Box>{err}</Box>}
      </Box>
    </Flex>
  );
};

export default Login;
