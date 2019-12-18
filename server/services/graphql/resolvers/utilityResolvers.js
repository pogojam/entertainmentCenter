const DATE = require("graphql-iso-date");

const MasterCode = 123983;

module.exports = {
  DATE,
  Query: {},
  Mutation: {
    newService: (parent, name, { auth, database, ...rest }) => {
      console.log("Server GRAPHQL", name);
      // const utilCollection = database.collection("utility").doc(name);
      // utilCollection.set({ name, cycle, startDate });

      //   const user = await auth.verifyIdToken(token);
      return {
        name: "Hi"
      };
    }
  }
};
