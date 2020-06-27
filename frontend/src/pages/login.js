import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AuthStore from "../components/state/stores/Auth_Store";
import { Box, Heading, Flex } from "rebass";
import useStyles from "./styles";

import { toJS } from "mobx";
import {
  Card,
  CardContent,
  Button,
  TextField,
  CardHeader,
} from "@material-ui/core";
const Input = styled.input``;

const InputBox = styled(Box)`
  & > * {
    margin: 1em;
    padding: 1em;
  }
`;

const Login = ({ initalState = true, location }) => {
  const [isLoginForm, setFormState] = useState(initalState);
  const classes = useStyles();

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
      as="form"
    >
      <Card
        className={classes.loginContainer}
        minWidth="40%"
        style={{ minWidth: "400px" }}
      >
        <CardHeader title={isLoginForm ? "login" : "Signup"} />
        <CardContent>
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

            <Box display="flex" justifyContent="space-around">
              <Button variant="outlined" type="submit">
                {isLoginForm ? "Login" : "Submit"}
              </Button>
              {isLoginForm && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setFormState(!isLoginForm);
                  }}
                >
                  Sign up
                </Button>
              )}
            </Box>
          </InputBox>
          {err && <Box>{err}</Box>}
        </CardContent>
      </Card>
    </Flex>
  );
};

export default Login;
