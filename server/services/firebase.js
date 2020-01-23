const admin = require("firebase-admin");

const Settings = require("../homeapp-a4fa0-firebase-adminsdk-wbegu-9368567a35.json");

admin.initializeApp({
  credential: admin.credential.cert(Settings),
  databaseURL: "https://homeapp-a4fa0.firebaseio.com"
});

const database = admin.firestore();
const auth = admin.auth();

module.exports = { database, auth, admin };
