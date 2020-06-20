function Layout(state, action) {
  switch (action.type) {
    case "SET_USER":
      return Object.assign({}, state, { user: action.input });
    case "REMOVE_USER":
      return Object.assign({}, state, { user: null });
    case "SET_PAGE":
      return Object.assign({}, state, { page: action.input });
    default:
      return state;
  }
}

export default { Layout };
