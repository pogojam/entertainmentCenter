const { makeStyles } = require("@material-ui/core");

const styles = makeStyles((theme) => ({
  iconButton: {
    backgroundColor: theme.palette.secondary.light,
  },
  card: {
    backgroundColor: theme.palette.secondary.main,
    padding: theme.spacing(2),
  },
  cardIcon: {
    fontSize: theme.spacing(3),
  },
  bill: {
    backgroundColor: theme.palette.secondary.dark,
    height: "100%",
    marginRight: theme.spacing(1),
    position: "relative",
  },
  list: {
    margin: 4,
    flexWrap: "nowrap",
    overflowY: "scroll",
    minHeight: theme.spacing(20),
  },
  form: {
    display: "flex",
    justifyContent: "space-evenly",
  },
  formAddBill: {
    height: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  tab: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "red",
    fontSize: ".4rem",
    width: "100%",
  },
  menu: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    height: "100%",
  },
  menuButtonContainer:{
    position:'absolute',
    right:0,
    height:'100%'
  },
  menuButton:{
    height:'100%',
    
  },
  menuTabs:{
flexBasis:'25%'
  },
  menuSubmenu: {
    height: "100%",
    backgroundColor: theme.palette.secondary.light,
    display: "flex",
    position: "relative",
    flexBasis: "100%",
    alignContent: "center",
    padding: theme.spacing(1),
  },
  
}));
export default styles;
