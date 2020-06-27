import { observable, action, autorun, flow } from "mobx";
import { client } from "../../../App";
import { QUERY_Bills } from "../../dash/Dash_Graphql";
import { persist } from "mobx-persist";

class ServicesStore {
  lastId = 0;
  @observable status = "pending";
  @observable @persist("list") bills = [];

  @action.bound
  getBills = flow(function* () {
    this.changeStatus("pending");
    try {
      const { data } = yield client.query({ query: QUERY_Bills });
      this.bills = data.getBills.map((bill) => {
        bill.id = this.lastId;
        this.lastId = this.lastId + 1;
        return bill;
      });
      this.changeStatus("loaded");
    } catch (error) {
      this.changeStatus(error);
    }
  });

  @action
  changeStatus = (newStatus) => {
    this.status = newStatus;
  };
}

const store = (window.store = new ServicesStore());
export default store;

autorun(() => {});
