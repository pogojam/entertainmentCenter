import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import { Dash, Movies, Music, Storage, Login } from "../pages";
import build from "../pages/build.json";
import Nav from "../components/nav/mainNav";
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
        maxHeight: "calc(100vh - 5em)"
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

const AppRouter = params => {
  const { User, handleLogout } = Auth.useContainer();

  const withUser = Component => props => <Component User={User} {...props} />;

  return (
    <Router>
      <Nav
        visible={true}
        pages={build.pages}
        isLoggedIn={User}
        logout={handleLogout}
      />
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
