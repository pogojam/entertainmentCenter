import React, { useEffect, useState } from "react";
import gql from "graphql-tag";
import { auth } from "../../filebase/config";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { createContainer } from "unstated-next";
import { useApolloClient } from "@apollo/react-hooks";
import { client } from "../../App";

const MUTATION_newUser = gql`
  mutation newUser($input: userInput) {
    newUser(input: $input) {
      firstName
    }
  }
`;
const QUERY_getRole = gql`
  query getRole($id: String) {
    getRole(id: $id) {
      role
    }
  }
`;

const handleLogin = ({ pass, email }) => {
  auth.signInWithEmailAndPassword(email, pass);
};

const creatNewUser = mutate => async ({
  pass,
  email,
  firstName,
  lastName,
  code
}) =>
  auth.createUserWithEmailAndPassword(email, pass).then(({ user }) => {
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
    }).catch(err => console.log(err));
  });

const handleLogout = () => {
  auth.signOut();
};

const useAuth = () => {
  const [User, setUser] = useState(null);
  const [addUser] = useMutation(MUTATION_newUser, { client: client });
  const [getRole, { loading, data }] = useLazyQuery(QUERY_getRole, {
    client: client
  });
  const handleNewuser = creatNewUser(addUser);

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        const id = user.uid;
        setUser(user);
        user.getIdToken().then(tk => {
          localStorage.setItem("token", tk);
        });
        getRole({
          variables: { id }
        });
      } else {
        setUser(null);
        localStorage.removeItem("token");
      }
    });
  }, []);

  useEffect(() => {
    if (data) {
      setUser(prev => ({ ...prev, ...data.getRole }));
    }
  }, [data]);

  return { User, handleNewuser, handleLogin, handleLogout };
};

export const Auth = createContainer(useAuth);
