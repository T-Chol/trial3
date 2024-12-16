import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import TaskList from '../components/TaskList';
import { useAuth } from '../context/AuthProvider';
import styled from 'styled-components';

const PageTitle = styled.h1`
  font-size: 24px;
  color: #1a202c;
  margin-bottom: 24px;
  padding: 0 20px;
`;

const MyTasksPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <DashboardLayout isOpen={isOpen} toggleSidebar={toggleSidebar}>
      <PageTitle>My Tasks</PageTitle>
      <TaskList filterByUser={true} />
    </DashboardLayout>
  );
};

export default MyTasksPage;