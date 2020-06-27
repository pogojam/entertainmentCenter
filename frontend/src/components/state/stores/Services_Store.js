import { observable, toJS, action, autorun, flow } from "mobx";
import { client } from "../../../App";
import {
  QUERY_Services,
  QUERY_Bills,
  MUTATION_changeBill,
} from "../../dash/Dash_Graphql";
import moment from "moment";

class ServicesStore {
  @observable status = "pending";
  @observable services = [];
  @observable bills = { ids: [] };
  @observable lastId = 0;

  get getBills() {
    const bills = toJS(this.bills);
    return bills.ids.map((id) => toJS(this.bills[id]));
  }

  @action.bound
  getServices = flow(function* () {
    this.changeStatus("pending");
    try {
      const { data } = yield client.query({ query: QUERY_Services });
      this.services = data.getServices;
      if (this.bills.ids.length === 0) {
        yield this.services.map(({ name }) => this.getServiceBills(name));
      }
      this.changeStatus("loaded");
    } catch (error) {
      this.changeStatus(error);
    }
  });

  @action.bound
  getServiceBills = flow(function* (service) {
    this.changeStatus("pending");
    try {
      const { data } = yield client.query({
        query: QUERY_Bills,
        variables: { service },
      });
      data.getBills.forEach((bill) => {
        bill.dueDate = moment(bill.dueDate._seconds).format("MM/DD/YYYY");
        this.bills[bill.id] = bill;

        if (!this.bills.ids.includes(bill.id)) {
          this.bills.ids.push(bill.id);
        }
      });
      this.changeStatus("loaded");
    } catch (error) {
      this.changeStatus(error);
    }
  });
  @action.bound
  changeBill = flow(function* ({ amount, id }) {
    const variables = {
      input: {
        amount: Number(amount),
        bill: id,
      },
    };

    const newBill = yield client.mutate({
      mutate: MUTATION_changeBill,
      variables,
    });
  });
  @action
  changeStatus = (newStatus) => {
    this.status = newStatus;
  };
}

const store = (window.store = new ServicesStore());

autorun(() => {
  //   console.log("Logging", store.page);
});
export default store;
