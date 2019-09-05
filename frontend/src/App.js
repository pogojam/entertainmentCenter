import { ApolloClient } from "apollo-client";
import React from "react";
import AppRouter from "./routes/router";
import "animate.css";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { ApolloProvider } from "@apollo/react-hooks";
import "./App.css";

const client = new ApolloClient({
  link: createUploadLink({ uri: "http://localhost:5000/graphql" }),
  cache: new InMemoryCache()
});

function App() {
  return (
    <div style={{ overflowY: "scroll" }} className="App">
      <ApolloProvider client={client}>
        <AppRouter />
      </ApolloProvider>
    </div>
  );
}

export default App;
