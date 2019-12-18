import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { auth } from "../../filebase/config";

const listeners = [];
let isValidated = false;

const MUTATION_newUser = gql`
  mutation newUser($input: userInput) {
    newUser(input: $input) {
      firstName
    }
  }
`;

const MUTATION_login = gql`
  mutation login($input: loginInput) {
    newUser(input: $input) {
      firstName
    }
  }
`;

const loginUser = (e, { pass, email }) => {
  e.preventDefault();
  auth.signInWithEmailAndPassword(email, pass).then(e => {
    // listeners.forEach(lis => lis(true));
  });
};

const creatNewUser = (
  e,
  { pass, email, firstName, lastName, code },
  setErr
) => {
  e.preventDefault();
  auth
    .createUserWithEmailAndPassword(email, pass)
    .then(e => {
      console.log(e);
    })
    .catch(err => {
      err && setErr(err.message);
    });
};

const logoutUser = () => {
  auth.signOut();
  // listeners.forEach(e => e(false));
};

export const useAuth = params => {
  const [isLoggedIn, setLogin] = useState(null);
  const [token, setToken] = useState("123");

  auth.onAuthStateChanged(user => {
    if (user) {
      console.log(user);
      listeners.forEach(e => e(user.refreshToken));
      setToken(user.refreshToken);
      console.log(user);
    } else {
      listeners.forEach(e => e(false));
    }
  });

  useEffect(() => {
    console.log("USER STATUS", auth.currentUser);
    listeners.push(setLogin);
  }, []);

  return [isLoggedIn, creatNewUser, loginUser, logoutUser, token];
};
