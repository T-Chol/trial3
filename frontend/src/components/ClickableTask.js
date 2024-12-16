import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ClickableWrapper = styled.div`
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const ClickableTask = ({ children, taskId }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    // Prevent navigation if clicking on buttons or links
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    navigate(`/task/${taskId}`);
  };

  return (
    <ClickableWrapper 
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleClick(e)}
    >
      {children}
    </ClickableWrapper>
  );
};

export default ClickableTask;