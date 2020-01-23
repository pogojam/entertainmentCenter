import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import styled from "styled-components";
import { Box } from "rebass";
import moment from "moment";
import { MdDragHandle } from "react-icons/md";
import { Chore } from "./Dash_Chore";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
// Calendar should be able to switch between a week , month and year

// ## Calendar
// 1: Sould be able to make chores for each weekday

// ## Day Card
// 1: DayCards should show chores due by what user on that day
// 2: Users that are set for a chore for the day can change chore status of that day

const MUTATION_addChore = gql`
  mutation addChore($input: choreInput) {
    addChore(input: $input) {
      chore
      date
    }
  }
`;

const QUERY_chores = gql`
  query getChores($start: DATE, $end: DATE) {
    getChores(start: $start, end: $end) {
      chore
      date
      user
      complete
    }
  }
`;

const outlook = {
  week: 7,
  month: 30,
  year: 365
};

const DayContainer = styled(Box)`
  overflow: hidden;
  position: relative;
  height: 50vh;
`;

const CalendarContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(7, minMax(100px, 1fr));
  grid-template-rows: 50px;
  min-height: 300px;
  .label {
    padding: 1em;
    background: #240d2f;
  }
`;

const MenuContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  background: black;
  transition: 0.4s cubic-bezier(0.075, 0.82, 0.165, 1);
  transform: ${({ status, offset }) =>
    status ? `translateY(-10%)` : `translateY(-100%) translateY(${offset})`};
  .menu_button {
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const buildWeek = () => {
  let week = [];
  const daysInWeek = 7;
  for (let i = 0; i < daysInWeek; ++i) {
    week.push(moment().add(i, "days"));
  }
  return week;
};

const Menu = ({ date, offset, setOffset }) => {
  const [status, toggle] = useState(false);

  const buttonRef = useRef(null);
  const containerRef = useRef(null);
  const dateHeader = date
    .clone()
    .format("YYYY-MM-DD")
    .toString();

  const calcOffset = () => {
    const containerHeight = containerRef.current.getBoundingClientRect().height;
    const buttonHeight = buttonRef.current.getBoundingClientRect().height;
    const padding = 10;
    setOffset({
      menu: `${buttonHeight + padding}px`,
      content: buttonHeight + padding + `px`
    });
  };

  useLayoutEffect(() => {
    // sizeObserver.observe(containerRef.current);
    calcOffset();
  }, []);

  return (
    <MenuContainer ref={containerRef} offset={offset.menu} status={status}>
      <Box
        ref={buttonRef}
        onClick={() => toggle(!status)}
        className={"menu_button"}
      >
        <Box fontSize=".5em">{dateHeader}</Box>
        <MdDragHandle />
      </Box>
    </MenuContainer>
  );
};

const DayCard = ({ date, index, data }) => {
  const bgColors = ["#0a0a0724", "#dde2ef24"];
  //Chore data structure {chore:'chore name',users:['users responsible for task']}
  const [chores, setChores] = useState(data);
  const [mutateChores] = useMutation(MUTATION_addChore);
  const [offset, setOffset] = useState({ menu: "-85%", content: "0px" });

  useEffect(() => {
    setChores(data);
  }, [data]);

  const handleDragOver = e => {
    e.preventDefault();
  };
  const handleDrop = e => {
    const newChoreName = e.dataTransfer.getData("id");
    setChores(oldChores => {
      // if chore is not in chores list add new chore
      const alreadyChore = oldChores.reduce((acc, { chore }) => {
        if (chore === newChoreName) return (acc = true);
        else return acc;
      }, false);
      if (!alreadyChore) return [...oldChores, { chore: newChoreName }];
      return oldChores;
    });
  };

  const addChore = (chore, user) => {
    console.log(chore);
    mutateChores({
      variables: {
        input: {
          chore,
          user,
          date
        }
      }
    });
  };

  return (
    <DayContainer
      pt={offset.content}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      bg={index % 2 < 1 ? bgColors[0] : bgColors[1]}
    >
      <Menu date={date} offset={offset} setOffset={setOffset} />
      {chores.map((data, i) => (
        <Chore.Alert setChore={addChore} key={i} {...data} />
      ))}
    </DayContainer>
  );
};

export const Calendar = ({ outlook = 7 }) => {
  const Days = useRef(buildWeek());
  const { data, loading, error } = useQuery(QUERY_chores, {
    variables: {
      start: Days.current[0],
      end: Days.current[Days.current.length - 1]
    }
  });

  return (
    <CalendarContainer className={"wrapper"}>
      {Days.current.map(
        (day, i) =>
          i < 7 && (
            <div key={i} className="label">
              {day.format("dddd").toString()}
            </div>
          )
      )}
      {Days.current.map((day, i) => {
        const dayData = [];
        if (data.getChores) {
          data.getChores.forEach(
            chore =>
              moment(day).isSame(chore.date, "day") && dayData.push(chore)
          );
        }
        return <DayCard data={dayData} index={i} date={day} key={i} />;
      })}
    </CalendarContainer>
  );
};
