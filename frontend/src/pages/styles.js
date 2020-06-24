import styled from "styled-components";

const { makeStyles } = require("@material-ui/core");

const styles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(2),
  },
  calendarContainer: {
    color: "white",
  },
}));
export default styles;
