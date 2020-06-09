import { ApolloClient } from "apollo-client";
import React from "react";
import AppRouter from "./routes/router";
import "animate.css";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { ApolloProvider } from "@apollo/react-hooks";
import { setContext } from "apollo-link-context";
import { Auth } from "./components/auth/index";
import { StripeProvider } from "react-stripe-elements";
import "./filebase/config";
import "./App.css";

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? token : "",
    },
  };
});

const uploadLink = createUploadLink({
  uri: window.location.hostname + ":5000/graphql",
});

export const client = new ApolloClient({
  link: authLink.concat(uploadLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <div style={{ overflowY: "scroll" }} className="App">
      <StripeProvider apiKey={process.env.REACT_APP_STRIPE_KEY}>
        <Auth.Provider>
          <ApolloProvider client={client}>
            <AppRouter />
          </ApolloProvider>
        </Auth.Provider>
      </StripeProvider>
    </div>
  );
}

export default App;
