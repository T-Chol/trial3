import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Clock from './Clock';

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
`;

const MainContent = styled.div`
  flex: 1;
  min-width: 0;
  margin-left: ${props => props.isSidebarOpen ? '240px' : '0'};
  transition: margin-left 0.3s ease;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const Header = styled.header`
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PageContent = styled.main`
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <DashboardContainer>
      <Sidebar isOpen={isSidebarOpen} />
      <MainContent isSidebarOpen={isSidebarOpen}>
        <Header>
          <Clock />
        </Header>
        <PageContent>
          {children}
        </PageContent>
      </MainContent>
    </DashboardContainer>
  );
};

export default DashboardLayout;