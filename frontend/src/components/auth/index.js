import React, { useEffect, useState } from "react";
import gql from "graphql-tag";
import { auth } from "../../filebase/config";

const listeners = [];
let token = null;

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
    .then(e => {})
    .catch(err => {
      err && setErr(err.message);
    });
};

const logoutUser = () => {
  auth.signOut();
};

export const useAuth = params => {
  const [isLoggedIn, setLogin] = useState(token);

  auth.onAuthStateChanged(user => {
    if (user) {
      user.getIdToken().then(tk => {
        token = tk;
        listeners.forEach(e => e(tk));
      });
    } else {
      token = null;
      listeners.forEach(e => e(token));
    }
  });

  useEffect(() => {
    listeners.push(setLogin);
  }, []);

  return [isLoggedIn, creatNewUser, loginUser, logoutUser];
};
