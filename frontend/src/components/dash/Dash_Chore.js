import React from "react";
import styled from "styled-components";
import { Box } from "rebass";

import { GiVacuumCleaner, GiBroom } from "react-icons/gi";

const Chores = [
  {
    icon: GiVacuumCleaner,
    name: "Vaccum"
  },
  {
    icon: GiBroom,
    name: "Sweep"
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
    name: "Dishes"
  }
];

const Container = styled(Box)`
  display: flex;
  justify-content: space-evenly;
  font-size: 2em;
`;

const Preview = () => {
  const PreviewCard = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-basis: 100%;
    background-color: #0000007a;
    transition: opacity 0.7s cubic-bezier(0.39, 0.575, 0.565, 1);
    border-radius: 8px;
    margin: 0 15px;

    &:hover {
      opacity: 0.7;
    }
  `;

  const handleDrag = (e, id) => {
    e.dataTransfer.setData("id", id);
  };

  return (
    <Container className={"wrapper"}>
      {Chores.map(({ name, icon: Icon }, i) => (
        <PreviewCard key={i} draggable onDragStart={e => handleDrag(e, name)}>
          {/* <h2>{name}</h2> */}
          <Icon />
        </PreviewCard>
      ))}
    </Container>
  );
};

// Temp user data

const Users = [{ name: "Ryan" }];

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

const Alert = ({ chore, user, setChore }) => (
  <AlertContainer>
    {Chores.map(
      ({ name, icon: Icon }, i) => name === chore && <Icon key={i} />
    )}
    <Box bg="white" my="1em" style={{ height: "1px", width: "100%" }} />
    <select onChange={e => setChore(chore, e.target.value)} name="User">
      <option value="" disabled selected={user ? false : true}>
        Assign
      </option>
      {Users.map(({ name }) => (
        <option selected={user ? true : false} value={name}>
          {name}
        </option>
      ))}
    </select>
  </AlertContainer>
);

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
  Alert
};
