const DATE = require("graphql-iso-date");

module.exports = {
  DATE,
  Query: {
    getServices: async (parent, { token }, { database, auth, user }) => {
      return database.utility.getServices();
    },
    getBills: async (parent, { token, service }, { database, auth }) => {
      return database.utility.getBills(service);
    }
  },
  Mutation: {
    newService: async (parent, { input }, { auth, database, ...rest }) => {
      const { name, cycle, startDate, token } = input;
      database.utility.addService({ name, cycle, startDate });
    },
    removeService: async (parent, { input }, { auth, database, ...rest }) => {
      const { name } = input;
      database.utility.removeService(name);
    },
    changeBill: async (parent, { input }, { auth, database, ...rest }) => {
      const { amount, bill, token } = input;
      database.utility.changeBill({ amount, bill, token });
    }
  }
};
