import React, { useState, Children } from "react";
import styled from "styled-components";
import { Box } from "rebass";
// Calendar should be able to switch between a week , month and year

// ## Calendar
// 1: Sould be able to make chores for each weekday

// ## Day Card
// 1: DayCards should show chores due by what user on that day
// 2: Users that are set for a chore for the day can change chore status of that day

const outlook = {
  week: 7,
  month: 30,
  year: 365
};

const DayContainer = styled.div`
  background: black;
`;

const DayCard = () => {
  return <DayContainer></DayContainer>;
};

const CalendarContainer = styled.div`
  display: grid;
`;

export const Calendar = ({ outlook = 7 }) => {
  const Days = new Array(outlook);
  return (
    <CalendarContainer>
      {Days.map(day => (
        <DayCard />
      ))}
    </CalendarContainer>
  );
};
