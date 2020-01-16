const { database: firebaseDatabase, firebaseAuth } = require("./firebase");
const axio = require("axios");

const auth = {
  rolesRef: firebaseDatabase.collection("roles"),
  getRole: async function(id) {
    const dbRole = await this.rolesRef.doc(id).get();
    const role = await dbRole.data();
    return role;
  },
  setRole: async function({ id, role }) {
    const newRole = await this.rolesRef.doc(id).set({
      id,
      role
    });
    return newRole;
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
  movie
};

module.exports = { database };
