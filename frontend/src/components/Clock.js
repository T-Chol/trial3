import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ClockContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Arial', sans-serif;
  color: #333;
`;

const Time = styled.div`
  font-size: 36px; /* Decreased font size */
  font-weight: bold;
`;

const DateTimeContainer = styled.div`
  font-size: 18px; /* Decreased font size */
  text-align: center;
`;

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerID);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <ClockContainer>
      <DateTimeContainer>{formatDate(time)}</DateTimeContainer>
      <Time>{formatTime(time)}</Time>
    </ClockContainer>
  );
};

export default Clock;
