import { observable, action, autorun } from "mobx";
import { create, persist } from "mobx-persist";

class LayoutStore {
  @observable @persist page = 0;
  @observable drawer = { isOpen: false, side: "left", Component: [] };
  @action changePage = (index) => {
    this.page = index;
  };
  @action openDrawer = (drawerItem) => {
    this.drawer.isOpen = true;
    this.drawer.Component = drawerItem;
  };

  @action closeDrawer = (drawerItem) => {
    this.drawer.isOpen = false;
    this.drawer.Component = null;
  };
}

const hydrater = create({
  jsonify: true,
});
const store = (window.store = new LayoutStore());
export default store;
hydrater("LayoutStore", store).then(() => {});
autorun(() => {});
