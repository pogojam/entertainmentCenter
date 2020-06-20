const {
  database: firebaseDatabase,
  firebaseAuth,
  admin,
} = require("./firebase");
const axio = require("axios");

const chore = {
  choresRef: firebaseDatabase.collection("chores"),
  setChore: async function ({ chore, date, user, complete, id }) {
    try {
      const timeStamp = admin.firestore.Timestamp.fromDate(new Date(date));
      if (id) {
        return this.choresRef.doc(id).update({
          chore,
          date: timeStamp,
          user,
          complete,
        });
      }
      if (!id) {
        const newChore = await this.choresRef.doc(chore + date).set({
          chore,
          date: timeStamp,
          user,
          complete: false,
        });
        return newChore;
      }
    } catch (err) {
      console.log(err);
    }
  },
  getChores: async function ({ start, end }) {
    const output = [];
    try {
      const chores = await this.choresRef
        .where("date", ">", new Date(start))
        .where("date", "<", new Date(end))
        .get();

      chores.forEach((snap) => {
        const data = snap.data();
        data.date = data.date.toDate();
        data.id = snap.id;
        output.push(data);
      });

      return output;
    } catch (err) {
      console.log(err);
    }
  },
};

const auth = {
  usersRef: firebaseDatabase.collection("users"),
  getUser: async function (id) {
    const output = [];
    if (id.length === 1) {
      const dbRole = await this.usersRef.doc(id[0]).get();
      const user = await dbRole.data();
      output.push(user);
    }
    return output;
  },
  addUser: async function (userData) {
    const newUser = await this.usersRef.doc(userData.id).set(userData);
    return newUser;
  },
  updateUser: async function (uid, userData) {
    const newUser = await this.usersRef.doc(uid).update(userData);
    return newUser;
  },
};

const utility = {
  serviceRef: firebaseDatabase.collection("service"),
  billsRef: firebaseDatabase.collection("bills"),
  getServices: async function () {
    const services = await this.serviceRef.get();
    const output = [];
    services.forEach((snap) => {
      output.push(snap.data());
    });
    return output;
  },
  removeBill: async function (id) {
    try {
      const newBill = await this.billsRef.doc(id).delete();
      return newBill;
    } catch (err) {
      console.log(err);
    }
  },
  removeBills: async function (c1, del, c2) {
    try {
      const removedItem = await this.billsRef.where(c1, del, c2).get();
      const batch = firebaseDatabase.batch();
      removedItem.forEach((bill) => {
        batch.delete(bill.ref);
      });
      batch.commit().then(() => {
        console.log("Successfully executed batch.");
      });
      return removedItem;
    } catch (error) {
      console.log(error);
    }
  },
  getBills: async function (service) {
    const output = [];
    const bills = await this.billsRef.where("service", "==", service).get();
    bills.forEach((snap) => {
      output.push({ id: snap.id, ...snap.data() });
    });
    return output;
  },
  changeBill: async function ({ amount, bill, token }) {
    try {
      const newBill = await this.billsRef.doc(bill).update({ amount: amount });
      return newBill;
    } catch (err) {
      console.log(err);
    }
  },
  addService: async function ({ name, cycle, startDate }) {
    const newService = await this.serviceRef
      .doc(name)
      .set({ name, cycle, startDate });
    return newService;
  },
  removeService: async function (name) {
    this.serviceRef.doc(name).delete();
  },
};

const movie = {
  omdbPath: `http://www.omdbapi.com/?apikey=${process.env.OMBD}&`,
  moviesRef: firebaseDatabase.collection("movies"),
  getMovies: async function (input) {
    const movies = await this.moviesRef.get();
    const output = [];
    movies.forEach((e) => {
      if (e.data().Genre.includes(input)) {
        output.push(e.data());
      }
    });

    return output;
  },
  getMovielist: async function () {
    const extension = "/genre/movie/list";
    try {
      const data = await axio.get(this.omdbPath + extension);
      return data;
    } catch (err) {
      console.log(err);
    }
  },
  getMovie: async function () {
    axio.get(this.omdbPath + "t=" + title).then(({ data }) => {
      if (data.Error) return data.Error;
      return data;
    });
  },
};

const database = {
  auth,
  utility,
  movie,
  chore,
};

module.exports = { database };
