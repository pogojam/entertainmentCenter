const { makeStyles } = require("@material-ui/core");

const styles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(2),
    height: "100%",
  },
  calendarContainer: {
    color: "white",
  },
  loginContainer: {
    backgroundColor: theme.palette.secondary.main,
  },
}));
export default styles;
