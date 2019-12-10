import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Home, Movies, Music, Storage } from "../pages";
import build from "../pages/build.json";
import Nav from "../components/nav/mainNav";

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

const AppRouter = params => (
  <Router>
    <Nav visible={true} pages={build.pages} />
    <Layout>
      <Route path="/" exact component={Home} />
      <Route path="/Movies" exact component={Movies} />
      <Route path="/Music" exact component={Music} />
      <Route path="/Storage" exact component={Storage} />
    </Layout>
  </Router>
);

export default AppRouter;
