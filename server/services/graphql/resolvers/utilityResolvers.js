const DATE = require("graphql-iso-date");

const MasterCode = 123983;

module.exports = {
  DATE,
  Query: {
    getServices: async (parent, { token }, { database, auth }) => {
      const user = await auth.verifyIdToken(token);
      const output = [];
      if (user.uid) {
        const services = await database.collection("service").get();
        services.forEach(snap => {
          output.push(snap.data());
        });
        return output;
      }
    },
    getBills: async (parent, { token, service }, { database, auth }) => {
      const user = await auth.verifyIdToken(token);
      const output = [];
      if (user.uid) {
        const bills = await database
          .collection("bills")
          .where("service", "==", service)
          .get();
        bills.forEach(snap => {
          output.push({ id: snap.id, ...snap.data() });
        });
        return output;
      }
    }
  },
  Mutation: {
    newService: async (parent, { input }, { auth, database, ...rest }) => {
      const { name, cycle, startDate, token } = input;

      const user = await auth.verifyIdToken(token);

      if (user.uid) {
        const utilCollection = database.collection("service").doc(name);
        await utilCollection.set({ name, cycle, startDate });
      } else {
      }
    },
    removeService: async (parent, { input }, { auth, database, ...rest }) => {
      const { name, cycle, startDate, token } = input;

      const user = await auth.verifyIdToken(token);

      if (user.uid) {
        const service = await database
          .collection("service")
          .doc(name)
          .delete();
      } else {
      }
    },
    changeBill: async (parent, { input }, { auth, database, ...rest }) => {
      const { amount, service, token } = input;
      try {
        const user = await auth.verifyIdToken(token);
        console.log(service);
        if (user.uid) {
          const bill = await database
            .collection("bills")
            .doc(service)
            .update({ amount: amount });
        } else {
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};
