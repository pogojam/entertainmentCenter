const {
  database: firebaseDatabase,
  firebaseAuth,
  admin
} = require("./firebase");
const axio = require("axios");

const chore = {
  choresRef: firebaseDatabase.collection("chores"),
  setChore: async function({ chore, date, user }) {
    try {
      const timeStamp = admin.firestore.Timestamp.fromDate(new Date(date));
      console.log(timeStamp);
      const newChore = await this.choresRef.doc(chore + date).set({
        chore,
        date: timeStamp,
        user,
        complete: false
      });
      return newChore;
    } catch (err) {
      console.log(err);
    }
  },
  getChores: async function({ start, end }) {
    const output = [];
    try {
      const chores = await this.choresRef
        .where("date", ">", new Date(start))
        .where("date", "<", new Date(end))
        .get();

      chores.forEach(snap => {
        const data = snap.data();
        data.date = data.date.toDate();
        output.push(data);
      });

      return output;
    } catch (err) {
      console.log(err);
    }
  }
};

const auth = {
  usersRef: firebaseDatabase.collection("users"),
  getUser: async function(id) {
    const output = [];
    if (id.length === 1) {
      const dbRole = await this.usersRef.doc(id[0]).get();
      const user = await dbRole.data();
      output.push(user);
    }
    return output;
  },
  addUser: async function(userData) {
    const newUser = await this.usersRef.doc(userData.id).set(userData);
    return newUser;
  },
  updateUser: async function(uid,userData) {
    const newUser = await this.usersRef.doc(uid).update(userData);
    return newUser;
  }
};

const utility = {
  serviceRef: firebaseDatabase.collection("service"),
  billsRef: firebaseDatabase.collection("bills"),
  getServices: async function() {
    const services = await this.serviceRef.get();
    const output = [];
    services.forEach(snap => {
      output.push(snap.data());
    });
    return output;
  },
  getBills: async function(service) {
    const output = [];
    const bills = await this.billsRef.where("service", "==", service).get();
    bills.forEach(snap => {
      output.push({ id: snap.id, ...snap.data() });
    });
    return output;
  },
  changeBill: async function({ amount, service, token }) {
    const newBill = await this.billsRef.doc(service).update({ amount: amount });
    return newBill;
  },
  addService: async function({ name, cycle, startDate }) {
    const newService = await this.serviceRef
      .doc(name)
      .set({ name, cycle, startDate });
    console.log(newService);
    return newService;
  },
  removeService: async function(name) {
    this.serviceRef.doc(name).delete();
  }
};

const movie = {
  omdbPath: `http://www.omdbapi.com/?apikey=${process.env.OMBD}&`,
  moviesRef: firebaseDatabase.collection("movies"),
  getMovies: async function(input) {
    const movies = await this.moviesRef.get();
    const output = [];
    movies.forEach(e => {
      if (e.data().Genre.includes(input)) {
        output.push(e.data());
      }
    });
    return output;
  },
  getMovielist: async function() {
    const extension = "/genre/movie/list";
    try {
      const data = await axio.get(this.omdbPath + extension);
      return data;
    } catch (err) {
      console.log(err);
    }
  },
  getMovie: async function() {
    axio.get(this.omdbPath + "t=" + title).then(({ data }) => {
      if (data.Error) return data.Error;
      return data;
    });
  }
};

const database = {
  auth,
  utility,
  movie,
  chore
};

module.exports = { database };
