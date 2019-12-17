import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Home, Movies, Music, Storage, Login } from "../pages";
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
        marginTop: "5em"
      }}
    >
      {children}
    </div>
  );
};

const AppRouter = params => {
  const [isLoggedIn, ...authRest] = useAuth();

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
        <Route path="/" exact component={Home} />
        <Route path="/Login" exact component={Login} />
        <PrivateRoutes isLoggedIn={isLoggedIn}>
          <Route path="/Movies" exact component={Movies} />
          <Route path="/Music" exact component={Music} />
          <Route path="/Storage" exact component={Storage} />
        </PrivateRoutes>
      </Layout>
    </Router>
  );
};

export default AppRouter;
