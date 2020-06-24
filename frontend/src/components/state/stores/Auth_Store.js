import { observable, action, autorun, flow } from "mobx";
import { auth } from "../../../filebase/config";
import { client } from "../../../App";
import {} from "../../dash/Dash_Graphql";
import { QUERY_getUser } from "./api/Api_Querys";
import { MUTATION_newUser } from "./api/Api_Mutations";
import { create, persist } from "mobx-persist";

class AuthStore {
  constructor() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const id = [user.uid];
        // this.setUser(user);
        user.getIdToken().then((tk) => {
          localStorage.setItem("token", tk);
          localStorage.setItem("uid", id);
        });
        this.getUserData(id);
      } else {
        this.setUser({}, false);
        localStorage.removeItem("token");
        localStorage.removeItem("uid");
      }
    });
  }
  //Temp logged in state for development
  @observable @persist isLoggedIn = true;
  @observable @persist user = {};
  @observable @persist role = "";

  @action getUserData = flow(function* (id) {
    const { data } = yield client.query({
      query: QUERY_getUser,
      variables: { id },
    });
    this.setUser(data.getUser, true);
  });

  @action setUser = (user, status) => {
    this.user = user;
    this.isLoggedIn = status;
  };

  @action loginUser = (index) => {
    const { email, pass } = index;
    auth.signInWithEmailAndPassword(email, pass);
    console.log(this.user);
  };
  @action logoutUser = () => {
    auth.signOut();
    this.setUser({}, false);
  };
  @action createUser = flow(function* ({
    pass,
    email,
    firstName,
    lastName,
    code,
  }) {
    const user = yield auth.createUserWithEmailAndPassword(email, pass);
    const { uid } = user;
    const variables = {
      input: {
        id: uid,
        firstName,
        code,
        email,
      },
    };
    client.mutate({ mutation: MUTATION_newUser, variables });
  });
}
const hydrater = create({
  jsonify: true,
});

const store = new AuthStore();
export default store;
hydrater("Auth_Store", store).then(() => console.log("HYDRATED"));
