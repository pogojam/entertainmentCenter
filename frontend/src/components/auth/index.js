import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { auth } from "../../filebase/config";

const listeners = [];

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
    listeners.forEach(lis => lis(true));
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

auth.onAuthStateChanged(user => {
  if (user) {
    listeners.forEach(e => e(true));
  } else {
    listeners.forEach(e => e(false));
  }
});

export const useAuth = params => {
  const [isLoggedIn, setLogin] = useState(null);

  useEffect(() => {
    console.log("USER STATUS", auth.currentUser);
    listeners.push(setLogin);
  }, []);

  return [isLoggedIn, creatNewUser, loginUser, logoutUser];
};
