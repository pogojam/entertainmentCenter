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
import { Auth } from "../components/auth/index";

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
      }}
    >
      {children}
    </div>
  );
};

const PrivateRoutes = ({ User, children }) => {
  return (
    <Route
      render={({ location, ...rest }) => {
        return !User ? (
          <Redirect key={location.pathname} to="/Login" />
        ) : (
          children
        );
      }}
    />
  );
};

const AppRouter = () => {
  const { User, handleLogout } = Auth.useContainer();
  const withUser = useCallback((Component) => () => <Component User={User} />, [
    User,
  ]);
  return (
    <Router>
      <Nav isLoggedIn={User} logout={handleLogout} />
      <Layout>
        <Switch>
          <Route path="/Login" component={Login} />
          <PrivateRoutes User={User}>
            <Route path="/Dash" component={withUser(Dash)} />
            <Route path="/Movies" component={withUser(Movies)} />
            <Route path="/Music" component={withUser(Music)} />
            <Route path="/Storage" component={withUser(Storage)} />
          </PrivateRoutes>
        </Switch>
      </Layout>
    </Router>
  );
};

export default AppRouter;
