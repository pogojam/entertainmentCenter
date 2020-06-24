import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import useStyles from "./styles";
import { Service } from "../components/dash/services/Dash_Service";
import { Calendar } from "../components/dash/Dash_Calendar";
import { Box } from "rebass";
import { Chore } from "../components/dash/Dash_Chore";
import { MdEventAvailable, MdHome, MdSettings } from "react-icons/md";
import { PaymentForm } from "../components/forms/Form_Payment";
import { observer } from "mobx-react-lite";
import { Container, AppBar, Grid, Tabs, Tab, Paper } from "@material-ui/core";
import { Switch, Route, useRouteMatch, useHistory } from "react-router-dom";
import { toJS } from "mobx";

//Stores
import DashStore from "../components/state/stores/Dash_Store";
import ServicesStore from "../components/state/stores/Services_Store";
import Loader from "../components/loader";
import { TiHeadphones } from "react-icons/ti";

const HomePageContent = observer(({ role }) => {
  const classes = useStyles();

  switch (role) {
    case "user":
      return (
        <>
          <Calendar />
          <Chore.Preview />
        </>
      );
    case "admin":
      return (
        <Grid container>
          <Calendar />
          {/* <Chore.Preview /> */}
        </Grid>
      );
    default:
      return <Box />;
  }
});
const UtilityPageContent = observer(({ role }) => {
  const { getServices, getServiceBills, getBills } = ServicesStore;
  const services = toJS(ServicesStore.services);
  const bills = toJS(ServicesStore.bills);

  useEffect(() => {
    getServices();
  }, []);

  if (ServicesStore.status === "pending") return <Loader />;
  switch (role) {
    case "user":
    case "admin":
      return (
        <Service.Container>
          <Service.CreateService refetch={services} />
          {services.map(({ name }, i) => (
            <Service.Slider key={i} name={name}>
              {getBills
                .filter((e) => e.service === name)
                .map((billData) => (
                  <Service.Bill {...billData} />
                ))}
            </Service.Slider>
          ))}
        </Service.Container>
      );
    default:
      return <Box />;
  }
});

const AccountPageContent = ({ role }) => {
  switch (role) {
    case "user":
      return (
        <>
          <PaymentForm.Subscribe />
        </>
      );
    case "admin":
      return (
        <>
          <PaymentForm.Subscribe />
        </>
      );
    default:
      return <Box />;
  }
};

const Utility_Page = {
  title: "Utilites",
  icon: MdEventAvailable,
  Content: UtilityPageContent,
};

const Home_Page = {
  title: "Home",
  icon: MdHome,
  Content: HomePageContent,
};

const Account_Page = {
  title: "Account",
  icon: MdSettings,
  Content: AccountPageContent,
};

const Pages = [Utility_Page, Home_Page, Account_Page];

const Nav = observer(() => {
  const match = useRouteMatch();
  const history = useHistory();
  const getUrl = (link) => match.url + "/" + link;
  useEffect(() => {
    const defaultPage = Pages[0];
    const newUrl = getUrl(defaultPage.title);
    if (!DashStore.page) {
      DashStore.changePage(defaultPage.title);
      history.push(newUrl);
    } else {
      const lastPage = DashStore.page;
      history.push(getUrl(lastPage));
    }
  }, []);

  const handleChange = (e, value) => {
    DashStore.changePage(value);
    history.push(match.url + "/" + value);
  };

  return (
    <AppBar position="relative">
      <Tabs value={DashStore.page} onChange={handleChange}>
        {Pages.map(({ title, icon: Icon }, i) => (
          <Tab label={title} value={title} icon={<Icon></Icon>} />
        ))}
      </Tabs>
    </AppBar>
  );
});

export default observer(function Dash() {
  const classes = useStyles();
  const match = useRouteMatch();
  return (
    <Box height="100%">
      <Nav />
      <Box mx={4} className={classes.container}>
        <Switch>
          {Pages.map(({ title, Content }) => (
            <Route
              path={match.url + "/" + title}
              component={() => <Content role="admin" />}
            />
          ))}
        </Switch>
      </Box>
    </Box>
  );
});
