import { createMuiTheme } from "@material-ui/core/styles";

export default createMuiTheme({
  paper: {
    backgrounds: {
      contrast: "#000007a",
    },
  },
  palette: {
    bgCard: "aqua",
    primary: {
      main: "#4a148c",
    },
    secondary: {
      main: "#a6caf2",
    },
    error: {
      main: "#e50000",
      contrastText: "#ffffff",
    },
  },
});
