import React from "react";
import useStyles from "./chores/Dash_Chores_Styles";
import styled from "styled-components";
import { Box } from "rebass";

import { GiVacuumCleaner, GiBroom } from "react-icons/gi";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  ListItem,
  Paper,
  List,
  Avatar,
  ListItemText,
  Typography,
  Divider,
} from "@material-ui/core";

const Chores = [
  {
    icon: GiVacuumCleaner,
    name: "Vaccum",
  },
  {
    icon: GiBroom,
    name: "Sweep",
  },
  {
    icon: ({ height = "1em", width = "1em" }) => (
      <img
        src="https://res.cloudinary.com/dxjse9tsv/image/upload/v1579568714/General_Icons/furniture-and-household_1.svg"
        alt=""
        style={{ height: height, width: width }}
        color="white"
      />
    ),
    name: "Dishes",
  },
];

const Container = styled(Box)`
  display: flex;
  justify-content: space-evenly;
  font-size: 2em;
`;

const PreviewCard = styled(Grid)`
  min-height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-basis: 100%;
  background-color: #0000007a;
  transition: opacity 0.7s cubic-bezier(0.39, 0.575, 0.565, 1);
  max-width: 240px;
  border-radius: 20px;
  &:hover {
    opacity: 0.7;
  }
`;
const Preview = () => {
  const classes = useStyles();
  const handleDrag = (e, id) => {
    e.dataTransfer.setData("id", id);
  };

  return (
    <Card className={classes.previewCard}>
      <CardHeader title="Drag and drop chores into calendar"></CardHeader>
      <Divider />
      <CardContent>
        <List container>
          <Grid container justify="space-around" spacing={2}>
            {Chores.map(({ name, icon: Icon }, i) => (
              <PreviewCard
                className={classes.choreListItem}
                item
                key={i}
                draggable
                onDragStart={(e) => handleDrag(e, name)}
              >
                <Avatar style={{ backgroundColor: "black" }}>
                  <Icon />
                </Avatar>
                <ListItemText primary={name} />
              </PreviewCard>
            ))}
          </Grid>
        </List>
      </CardContent>
    </Card>
  );
};

// Temp user data

const Users = [{ name: "Ryan" }, { name: "Marvin" }, { name: "Vance" }];

const AlertContainer = styled(Box)`
  padding: 1em;
  margin: 0.5em;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #0000007a;
  select {
    width: 100%;
    background-color: transparent;
  }
`;

const Alert = ({ chore, user, id, complete, setChore }) => {
  return (
    <AlertContainer>
      {Chores.map(
        ({ name, icon: Icon }, i) => name === chore && <Icon key={i} />
      )}
      <Box bg="white" my="1em" style={{ height: "1px", width: "100%" }} />
      <select
        onChange={(e) => setChore(chore, e.target.value, id, complete)}
        name="User"
      >
        <option value="" disabled selected={user ? false : true}>
          Assign
        </option>
        {Users.map(({ name }, i) => (
          <option key={i} selected={user === name ? true : false} value={name}>
            {name}
          </option>
        ))}
      </select>
    </AlertContainer>
  );
};

const NewChore = () => {
  return (
    <Box>
      <form action="">
        <input type="name" />
        <input type="file" />
        <input type="submit" />
      </form>
    </Box>
  );
};

export const Chore = {
  Preview,
  Alert,
};
