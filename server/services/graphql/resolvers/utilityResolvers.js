const DATE = require("graphql-iso-date");

module.exports = {
  DATE,
  Query: {
    getServices: async (parent, { token }, { database, auth, user }) => {
      return database.utility.getServices();
    },
    getBills: async (parent, { token, service }, { database, auth }) => {
      return database.utility.getBills(service);
    },
  },
  Mutation: {
    newService: async (parent, { input }, { auth, database, ...rest }) => {
      const { name, cycle, startDate, token } = input;
      try {
        if (name && cycle && startDate) {
          database.utility.addService({ name, cycle, startDate });
        } else {
          throw "Must complete all fields";
        }
      } catch (error) {
        return error;
      }
    },
    removeService: async (parent, { input }, { auth, database, ...rest }) => {
      const { name } = input;
      database.utility.removeBills("service", "==", name);
      database.utility.removeService(name);
    },
    changeBill: async (parent, { input }, { auth, database, ...rest }) => {
      const { amount, bill, token } = input;
      database.utility.changeBill({ amount, bill, token });
    },
    removeBill: async (parent, { input }, { auth, database, ...rest }) => {
      database.utility.removeBill(input.id);
    },
  },
};
