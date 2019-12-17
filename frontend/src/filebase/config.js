import firebase from "firebase";
var firebaseConfig = {
  apiKey: "AIzaSyBO_cHeS4ajIPn5SNGEBhqRKQwJ_xq3bYc",
  authDomain: "homeapp-a4fa0.firebaseapp.com",
  databaseURL: "https://homeapp-a4fa0.firebaseio.com",
  projectId: "homeapp-a4fa0",
  storageBucket: "homeapp-a4fa0.appspot.com",
  messagingSenderId: "1051839781676",
  appId: "1:1051839781676:web:cab68e8e82023430e9aa89"
};
// Initialize Firebase
const APP = firebase.initializeApp(firebaseConfig);
const auth = APP.auth();

export { auth };
