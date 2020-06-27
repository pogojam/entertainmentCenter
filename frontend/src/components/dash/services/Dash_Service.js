import useStyles from "./Dash_Service_Styles";
import { useToggle } from "../../../util";
import React, { useState, useEffect, useRef } from "react";
import Icon from "../../icon";
import Loader from "../../loader";
import Menu from "../../menu";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { MUTATION_NewService } from "../Dash_Graphql";
import {
  Card,
  GridList,
  Typography,
  Grid,
  AppBar,
  FormLabel,
  CardHeader,
  CardContent,
  Box,
  TextField,
  FormControl,
  Button,
  Input,
  IconButton,
  Tabs,
  Tab,
  Paper,
} from "@material-ui/core";
import { useTransition, animated } from "react-spring";

const AddServiceForm = ({ refetch }) => {
  const [cycle, setCycle] = useState(null);
  const [startDate, setDate] = useState(null);
  const [name, setName] = useState(null);
  const [addService] = useMutation(MUTATION_NewService);

  const classes = useStyles();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addService({
      variables: {
        input: { cycle: parseInt(cycle, 10), startDate, name },
      },
    });
    await refetch();
    reset();
  };

  const reset = () => {
    setCycle(null);
    setDate(null);
    setName(null);
  };

  const handleChange = ({ target }, setter) => {
    setter(target.value);
  };

  return (
    <Grid
      container
      variant="form"
      className={classes.form}
      onSubmit={handleSubmit}
    >
      <Grid item>
        <FormControl>
          <FormLabel>Cycle Every</FormLabel>
          <TextField
            style={{ textAlign: "center" }}
            placeholder="In days"
            onChange={(e) => handleChange(e, setCycle)}
            type="number"
          />
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl>
          <FormLabel>Start Date</FormLabel>
          <TextField type="date" onChange={(e) => handleChange(e, setDate)} />
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl>
          <FormLabel>Service</FormLabel>
          <TextField
            type="text"
            style={{ textAlign: "center" }}
            placeholder="Service Name"
            onChange={(e) => handleChange(e, setName)}
          />
        </FormControl>
      </Grid>
      <Grid item>
        <Button variant="outlined" size="medium" type="submit">
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};

const CreateService = ({ refetch }) => {
  const classes = useStyles();
  return (
    <Grid item xs={12}>
      <Card className={classes.card}>
        <CardHeader title="New Utility Service" />
        <CardContent>
          <AddServiceForm refetch={refetch} />
        </CardContent>
      </Card>
    </Grid>
  );
};

const AddBillForm = () => {
  const classes = useStyles();
  const handleSubmit = () => {
    //
  };

  const handleChange = () => {
    //
  };

  return (
    <Grid container className={classes.formAddBill} onSubmit={handleSubmit}>
      <Grid item>
        <FormControl>
          <FormLabel>Cycle Every</FormLabel>
          <TextField
            style={{ textAlign: "center" }}
            placeholder="In days"
            onChange={(e) => handleChange(e)}
            type="number"
          />
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl>
          <FormLabel>Start Date</FormLabel>
          <TextField type="date" onChange={(e) => handleChange(e)} />
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl>
          <FormLabel>Service</FormLabel>
          <TextField
            type="text"
            style={{ textAlign: "center" }}
            placeholder="Service Name"
            onChange={(e) => handleChange(e)}
          />
        </FormControl>
      </Grid>
      <Grid item>
        <Button variant="outlined" size="medium" type="submit">
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};
const RemoveServiceForm = () => {
  return (
    <Grid
      spacing={2}
      component="form"
      style={{ width: "100%", justifyContent: "center", height: "100%" }}
      container
    >
      <Grid item>
        <FormControl>
          <TextField placeholder="Service Name" />
        </FormControl>
      </Grid>
      <Grid item>
        <Button variant="outlined">Delet</Button>
      </Grid>
    </Grid>
  );
};

const menuItems = [AddBillForm, AddServiceForm, RemoveServiceForm];
const AnimatedPaper = animated(Grid);

const SliderMenu = ({ name = "" }) => {
  const tabsRef = useRef();
  const [tabsWidth, setTabsWidth] = useState();
  const [index, setIndex] = useState(0);
  const classes = useStyles();
  const transition = useTransition(menuItems[index], null, {
    from: { position: "absolute", opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });
  // const MenuItem = menuItems[index];
  const handleChange = (e, i) => {
    setIndex(i);
  };

  useEffect(() => {
    if (tabsRef.current) {
      const ref = tabsRef.current;
      const width = ref.getBoundingClientRect().width;
      setTabsWidth(width);
    }
  }, []);

  return (
    <Box display="flex" className={classes.menu}>
      <Tabs
        value={index}
        className={classes.menuTabs}
        onChange={handleChange}
        orientation="vertical"
      >
        <Tab value={0} label="Add Bill" />
        <Tab value={1} label="Edit" />
        <Tab value={2} label="Remove" />
      </Tabs>

      <Box ref={tabsRef} flexBasis={"75%"}>
        {tabsWidth &&
          transition.map(({ item: MenuItem, key, props }) => (
            <AnimatedPaper
              container
              className={classes.menuSubmenu}
              key={key}
              style={{ ...props, width: tabsWidth }}
            >
              <MenuItem />
            </AnimatedPaper>
          ))}
      </Box>
    </Box>
  );
};

const Slider = ({ children, name }) => {
  const [showMenu, toggleMenu] = useToggle();

  const classes = useStyles();

  return (
    <Grid item sm={6} xs={12}>
      <Menu
        menuStatus={showMenu}
        toggleMenu={toggleMenu}
        tabBarPeek={0}
        drawerItem={() => <SliderMenu name={name} />}
        side="right"
      >
        <Card className={classes.card} width="100%">
          <CardHeader
            avatar={<Icon className={classes.cardIcon} type={"water"} />}
            title={name}
            subheader="Bills on file"
            action={
              <IconButton className={classes.iconButton} onClick={toggleMenu}>
                {" "}
                <Icon type="drag" />{" "}
              </IconButton>
            }
          />
          <Grid container className={classes.list}>
            {children}
          </Grid>
        </Card>
      </Menu>
    </Grid>
  );
};
export const Bill = ({ pastDue, amount, dueDate: date }) => {
  const classes = useStyles();
  console.log(date, amount);
  return (
    <Grid item>
      <Card className={classes.bill}>
        <Box px={2}>
          <CardContent>
            <Typography variant="h4" style={{ fontSize: "1.4em" }}>
              Due
            </Typography>
            <Typography variant="subtitle2">{date}</Typography>
            <Typography variant="subtitle2">{"$" + Number(amount)} </Typography>
          </CardContent>
        </Box>
        {pastDue && <PastDueTab className={classes.tab} />}
      </Card>
    </Grid>
  );
};
const PastDueTab = (props) => (
  <Typography {...props} fontSize=".2rem">
    PastDue
  </Typography>
);

const Container = ({ children }) => {
  return (
    <Grid container spacing={2}>
      {children}
    </Grid>
  );
};

export const Service = {
  CreateService,
  Slider,
  Container,
  Bill,
};
