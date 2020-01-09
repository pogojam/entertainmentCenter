import React from "react";
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
import { useAuth } from "../components/auth/index";

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

const AppRouter = params => {
  const [isLoggedIn, ...authRest] = useAuth();
  // const token = authState.token;

  const PrivateRoutes = ({ isLoggedIn, children }) => (
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

  return (
    <Router>
      <Nav
        visible={true}
        pages={build.pages}
        isLoggedIn={isLoggedIn}
        logout={authRest[2]}
      />
      <Layout>
        <Switch>
          <Route path="/Login" component={Login} />
          <PrivateRoutes isLoggedIn={isLoggedIn}>
            <Route path="/Dash" component={Dash} />
            <Route path="/Movies" component={Movies} />
            <Route path="/Music" component={Music} />
            <Route path="/Storage" component={Storage} />
          </PrivateRoutes>
        </Switch>
      </Layout>
    </Router>
  );
};

export default AppRouter;
