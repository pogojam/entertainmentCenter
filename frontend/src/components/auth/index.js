import React, { useEffect, useState } from "react";
import gql from "graphql-tag";
import { auth } from "../../filebase/config";
import { useMutation } from "@apollo/react-hooks";

const listeners = [];
let state = null;

const MUTATION_newUser = gql`
  mutation newUser($input: userInput) {
    newUser(input: $input) {
      permissions
    }
  }
`;

const loginUser = (e, { pass, email }) => {
  e.preventDefault();
  auth.signInWithEmailAndPassword(email, pass).then(e => {
    // listeners.forEach(lis => lis(true));
  });
};

const creatNewUser = mutate => (
  e,
  { pass, email, firstName, lastName, code },
  setErr
) => {
  e.preventDefault();

  auth
    .createUserWithEmailAndPassword(email, pass)
    .then(({ user }) => {
      const { uid } = user;
      mutate({
        variables: {
          input: {
            id: uid,
            firstName,
            code,
            email
          }
        }
      });
    })
    .catch(err => {
      err && setErr(err.message);
    });
};

const logoutUser = () => {
  auth.signOut();
};

const setGlobalState = newState => {
  const State = { ...newState, ...state };
  listeners.forEach(e => e(State));
};

export const useAuth = params => {
  const [State, setLogin] = useState(null);
  const [addUser] = useMutation(MUTATION_newUser);

  auth.onAuthStateChanged(user => {
    if (user) {
      user.getIdToken().then(tk => {
        setGlobalState({ token: tk });
      });
    } else {
      setGlobalState({});
    }
  });

  useEffect(() => {
    listeners.push(setLogin);
  }, []);

  return [state.token, creatNewUser(addUser), loginUser, logoutUser];
};
