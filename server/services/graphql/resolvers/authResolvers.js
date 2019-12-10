const DATE = require("graphql-iso-date");
const genres = require("../../../routes/library/genres.json");
const _ = require("lodash");

module.exports = {
  DATE,
  Query: {},
  Mutation: {
    newUser: (...arg) => {
      console.log(arg);
    }
  }
};
