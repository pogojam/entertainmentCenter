import { ApolloClient } from "apollo-client";
import React from "react";
import AppRouter from "./routes/router";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { ApolloProvider } from "@apollo/react-hooks";
import { setContext } from "apollo-link-context";
import { StripeProvider } from "react-stripe-elements";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import "./filebase/config";
import "./App.css";
import { Paper } from "@material-ui/core";

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
  uri: "http://" + window.location.hostname + ":5000/graphql",
});

export const client = new ApolloClient({
  link: authLink.concat(uploadLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <Paper className="App">
      <StripeProvider apiKey={process.env.REACT_APP_STRIPE_KEY}>
        <ThemeProvider theme={theme}>
          <ApolloProvider client={client}>
            <AppRouter />
          </ApolloProvider>
        </ThemeProvider>
      </StripeProvider>
    </Paper>
  );
}

export default App;
