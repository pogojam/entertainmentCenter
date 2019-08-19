import ApolloClient from "apollo-boost";
import React from "react";
import AppRouter from "./routes/router";
import "animate.css";
import theme from "./theme.js";
import { ApolloProvider } from "@apollo/react-hooks";

import "./App.css";

const client = new ApolloClient({
  uri: "http://localhost:5000/graphql"
});

function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <AppRouter />
      </ApolloProvider>
    </div>
  );
}

export default App;
