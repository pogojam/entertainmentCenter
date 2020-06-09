import React, { useEffect, useState } from "react";
import gql from "graphql-tag";
import { auth } from "../../filebase/config";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { createContainer } from "unstated-next";
import { client } from "../../App";

const MUTATION_newUser = gql`
  mutation newUser($input: userInput) {
    newUser(input: $input) {
      firstName
    }
  }
`;
const QUERY_getUser = gql`
  query getUser($id: [String]) {
    getUser(id: $id) {
      role
      autoPay
    }
  }
`;

const handleLogin = ({ pass, email }) => {
  auth.signInWithEmailAndPassword(email, pass);
};

const creatNewUser = (mutate) => async ({
  pass,
  email,
  firstName,
  lastName,
  code,
}) =>
  auth.createUserWithEmailAndPassword(email, pass).then(({ user }) => {
    const { uid } = user;
    mutate({
      variables: {
        input: {
          id: uid,
          firstName,
          code,
          email,
        },
      },
    }).catch((err) => console.log(err));
  });

const handleLogout = () => {
  auth.signOut();
};

const useAuth = () => {
  const [User, setUser] = useState(null);
  const [addUser] = useMutation(MUTATION_newUser, { client: client });
  const [getUser, { loading, data }] = useLazyQuery(QUERY_getUser, {
    client: client,
  });
  const handleNewuser = creatNewUser(addUser);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const id = [user.uid];
        setUser(user);
        user.getIdToken().then((tk) => {
          localStorage.setItem("token", tk);
          localStorage.setItem("uid", id);
        });
        getUser({
          variables: { id },
        });
      } else {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("uid");
      }
    });
    return () => {
      localStorage.removeItem("token");
      localStorage.removeItem("uid");
    };
  }, []);

  useEffect(() => {
    if (data) {
      const { getUser: user } = data;

      user && setUser((prev) => ({ ...prev, ...user[0] }));
    }
  }, [data]);
  return { User, handleNewuser, handleLogin, handleLogout };
};

export const Auth = createContainer(useAuth);
