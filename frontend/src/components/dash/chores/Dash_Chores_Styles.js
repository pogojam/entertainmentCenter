const { makeStyles } = require("@material-ui/core");

const styles = makeStyles((theme) => ({
  previewCard: {
    backgroundColor: theme.palette.secondary.main,
    flexBasis: "100%",
    color: "white",
  },
  choreList: {
    backgroundColor: theme.paper.backgrounds.contrast,
  },
}));
export default styles;
