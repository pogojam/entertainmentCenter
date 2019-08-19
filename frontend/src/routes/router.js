import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Home, Movies, Music, Storage } from "../pages";
import build from "../pages/build.json";
import Nav from "../components/nav/mainNav";

const AppRouter = params => (
  <Router>
    <Nav visible={true} pages={build.pages} />
    <Route path="/" exact component={Home} />
    <Route path="/Movies" exact component={Movies} />
    <Route path="/Music" exact component={Music} />
    <Route path="/Storage" exact component={Storage} />
  </Router>
);

export default AppRouter;
