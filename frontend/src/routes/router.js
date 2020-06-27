import _ from "lodash";
import React, { useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { Dash, Movies, Music, Storage, Login } from "../pages";
import Nav from "../components/nav/nav";
import AuthStore from "../components/state/stores/Auth_Store";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";

const Layout = ({ children }) => {
  return (
    <div
      style={{
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        paddingTop: "5em",
        maxHeight: "calc(100vh - 5em)",
        overflowY: "scroll",
      }}
    >
      {children}
    </div>
  );
};

const PrivateRoutes = ({ isLoggedIn, children }) => {
  return (
    <Route
      render={({ location, ...rest }) => {
        return !isLoggedIn ? (
          <Redirect key={location.pathname} to="/Login" />
        ) : (
          children
        );
      }}
    />
  );
};

const AppRouter = observer(() => {
  const { logoutUser, isLoggedIn } = AuthStore;
  const User = toJS(AuthStore.user);
  const withUser = useCallback((Component) => () => <Component User={User} />, [
    User,
  ]);

  return (
    <Router>
      <Nav isLoggedIn={isLoggedIn} logout={logoutUser} />
      <Layout>
        <Switch>
          <Route path="/Login" component={Login} />
          <PrivateRoutes isLoggedIn={isLoggedIn}>
            <Route path="/Dash" component={withUser(Dash)} />
            <Route path="/Movies" component={withUser(Movies)} />
            <Route path="/Music" component={withUser(Music)} />
            <Route path="/Storage" component={withUser(Storage)} />
          </PrivateRoutes>
        </Switch>
      </Layout>
    </Router>
  );
});

export default AppRouter;
