import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import { useAuth } from "../components/auth/index";
import { Box, Heading, Flex, Button } from "rebass";

const Input = styled.input``;

const InputBox = styled(Box)`
  & > * {
    margin: 1em;
    padding: 1em;
  }
`;

const Login = ({ initalState = true }) => {
  const [isLogin, setFormState] = useState(initalState);

  const [isLoggedIn, handleNewuser, handleLogin] = useAuth();
  const [err, setErr] = useState(null);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [code, setCode] = useState("");

  return isLoggedIn ? (
    <Redirect to="/Movies" />
  ) : (
    <Flex
      onSubmit={e =>
        isLogin
          ? handleLogin(e, { email, pass }, setErr)
          : handleNewuser(e, { email, pass, firstName, lastName, code }, setErr)
      }
      justifyContent="center"
      alignItems="center"
      style={{ height: "100%", width: "100%" }}
    >
      <Box minWidth="40%" bg="#22ce99" as="form" p="2em">
        <Heading>{isLogin ? "login" : "Signup"}</Heading>
        <InputBox
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            height: "100%"
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
          {!isLogin && (
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
                  setLast(target.value);
                }}
                placeholder="Code"
                name="code"
              />
            </>
          )}

          <Input type="submit" value={isLogin ? "Login" : "Submit"} />
          {isLogin && (
            <Button
              onClick={() => {
                setFormState(!isLogin);
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
