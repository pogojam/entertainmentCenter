import { observable, action, autorun, flow } from "mobx";
import { create, persist } from "mobx-persist";
import { client } from "../../../App";
import { QUERY_Services } from "../../dash/Dash_Graphql";

class DashStore {
  @observable @persist page = null;
  @action changePage = (index) => {
    this.page = index;
    console.log(this.page);
  };
}

const hydrater = create({
  jsonify: true,
});
const store = (window.store = new DashStore());
hydrater("DashStore", store).then(() => {
  console.log("Persist DashStore");
});
export default store;

autorun(() => {
  //   console.log("Logging", store.page);
});
