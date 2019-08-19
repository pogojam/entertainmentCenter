const { ApolloServer, gql } = require("apollo-server-express");
const path = require("path");
const {
  mergeTypes,
  mergeResolvers,
  fileLoader
} = require("merge-graphql-schemas");
const { database } = require("./firebase");

const context = ({ req }) => {
  return { database };
};

const typeDefs = mergeTypes(
  fileLoader(path.join(__dirname, "./graphql/types"))
);

const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./graphql/resolvers"))
);

const server = new ApolloServer({ typeDefs, resolvers, context });

module.exports = server;
