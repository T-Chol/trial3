import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthProvider.js';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar.js';
import Clock from '../components/Clock.js';
import ClickableTask from '../components/ClickableTask.js';
import { API_URL } from '../config/api.js';

import { 
  ClipboardList, Clock as ClockIcon, Users,AlertTriangle,Search,Activity,} from 'lucide-react';

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
`;

const Content = styled.div`
  flex: 1;
  padding: 30px;
  background-color: #f8fafc;
  margin-left: ${props => (props.isSidebarOpen ? '250px' : '60px')};
  transition: margin-left 0.3s;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 20px;
  }
`;

const TopSection = styled.div`
  margin-bottom: 30px;
`;

const WelcomeMessage = styled.div`
  font-size: 32px;
  color: #1e293b;
  font-weight: 600;
  margin-bottom: 10px;

  p {
    font-size: 16px;
    color: #64748b;
    margin-top: 8px;
    font-weight: normal;
    line-height: 1.5;
  }
`;

const SearchSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBar = styled.div`
  flex: 1;
  position: relative;
  max-width: 500px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 40px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  color: #1e293b;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 24px;
  margin: 30px 0;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const StatTitle = styled.h3`
  font-size: 18px;
  color: #64748b;
  font-weight: 500;
`;

const StatIcon = styled.div`
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background-color: ${props => props.bg || '#e2e8f0'};
  color: ${props => props.color || '#64748b'};
`;

const StatValue = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #1e293b;
  margin: 8px 0;
`;

const StatChange = styled.div`
  font-size: 14px;
  color: ${props => props.increase ? '#10b981' : '#64748b'};
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: ${props => props.increase ? '"↑"' : '""'};
  }
`;

const ActivityFeed = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-top: 24px;

  h2 {
    font-size: 20px;
    color: #1e293b;
    margin-bottom: 16px;
    font-weight: 600;
  }
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #dbeafe;
  color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 4px;
`;

const ActivityTime = styled.div`
  font-size: 14px;
  color: #64748b;
`;

const DeadlineTimeline = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-top: 24px;

  h2 {
    font-size: 20px;
    color: #1e293b;
    margin-bottom: 16px;
    font-weight: 600;
  }
`;

const TimelineItem = styled.div`
  display: flex;
  padding: 16px 0;
  border-left: 2px solid #e2e8f0;
  margin-left: 16px;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    left: -5px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #3b82f6;
  }

  .content {
    margin-left: 20px;
  }

  .task-name {
    font-weight: 500;
    color: #1e293b;
    margin-bottom: 4px;
  }

  .date {
    font-size: 14px;
    color: #64748b;
  }
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #991b1b;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: #3b82f6;
  font-size: 16px;
`;

const PrincipalOfficerDashboard = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalTasks: 0,
      teamMembers: 0,
      completedTasks: 0,
      pendingReview: 0
    },
    recentActivities: [],
    upcomingDeadlines: []
  });
  const [searchTerm, setSearchTerm] = useState('');


  // Modified fetchDashboardData function
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Only fetch tasks since that's what exists in your backend
      const response = await fetch(`${API_URL}/tasks`);
  
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
  
      const tasksData = await response.json();
  
      // Filter tasks for current PO
      const userTasks = tasksData.filter(task => {
        const assignees = task.assignedOfficer?.split(', ') || [];
        return assignees.includes(user.username);
      });
  
      // Calculate statistics
      const stats = {
        totalTasks: userTasks.length,
        teamMembers: new Set(userTasks.map(task => task.assignedOfficer)).size,
        completedTasks: userTasks.filter(task => task.status === 'Completed').length,
        pendingReview: userTasks.filter(task => task.status === 'Pending Review').length
      };
  
      // Get activities from tasks
      const recentActivities = userTasks.map(task => ({
        taskId: task.id,
        description: `Task "${task.name}" - ${task.status}`,
        timestamp: task.deadline
      })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);
      
      // Get upcoming deadlines from tasks
      const upcomingDeadlines = userTasks
        .filter(task => new Date(task.deadline) > new Date())
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 5);
  
      setDashboardData({
        stats,
        recentActivities,
        upcomingDeadlines
      });
    } catch (err) {
      setError('Failed to load dashboard data. Please try again later.');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const formatUsername = (username) => {
    return username
      ?.replace(/([a-z])([A-Z])/g, '$1 $2')
      ?.replace(/([0-9])/g, ' $1')
      ?.replace(/^./, str => str.toUpperCase());
  };

  if (isLoading) {
    return (
      <DashboardContainer>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <Content isSidebarOpen={isSidebarOpen}>
          <LoadingSpinner>Loading dashboard data...</LoadingSpinner>
        </Content>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Content isSidebarOpen={isSidebarOpen}>
        {error && (
          <ErrorMessage>
            <AlertTriangle size={20} />
            {error}
          </ErrorMessage>
        )}

        <TopSection>
          <Clock />
          <WelcomeMessage>
            Welcome back, {formatUsername(user?.username)}
            <p>Manage and oversee task assignments and monitor team performance</p>
          </WelcomeMessage>

          <SearchSection>
            <SearchBar>
              <SearchIcon>
                <Search size={20} />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Search tasks by name or assignee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBar>
          </SearchSection>
        </TopSection>

        <StatsGrid>
          <StatCard>
            <StatHeader>
              <StatTitle>Total Tasks</StatTitle>
              <StatIcon bg="#dbeafe" color="#3b82f6">
                <ClipboardList size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>{dashboardData.stats.totalTasks}</StatValue>
            <StatChange>Tasks assigned</StatChange>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatTitle>Team Members</StatTitle>
              <StatIcon bg="#dcfce7" color="#10b981">
                <Users size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>{dashboardData.stats.teamMembers}</StatValue>
            <StatChange increase>Active assignments</StatChange>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatTitle>Completed</StatTitle>
              <StatIcon bg="#fef3c7" color="#f59e0b">
                <ClockIcon size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>{dashboardData.stats.completedTasks}</StatValue>
            <StatChange increase>
              {((dashboardData.stats.completedTasks / dashboardData.stats.totalTasks) * 100).toFixed(1)}% success rate
            </StatChange>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatTitle>Pending Review</StatTitle>
              <StatIcon bg="#fee2e2" color="#ef4444">
                <AlertTriangle size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>{dashboardData.stats.pendingReview}</StatValue>
            <StatChange>Need attention</StatChange>
          </StatCard>
        </StatsGrid>

        <DeadlineTimeline>
  <h2>Upcoming Deadlines</h2>
  {dashboardData.upcomingDeadlines.map((task) => (
    <ClickableTask key={task.id} taskId={task.id}>
      <TimelineItem>
        <div className="content">
          <div className="task-name">{task.name}</div>
          <div className="date">Due: {new Date(task.deadline).toLocaleDateString()}</div>
        </div>
      </TimelineItem>
    </ClickableTask>
  ))}
  {dashboardData.upcomingDeadlines.length === 0 && (
    <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>
      No upcoming deadlines
    </p>
  )}
</DeadlineTimeline>

<ActivityFeed>
  <h2>Recent Activity</h2>
  {dashboardData.recentActivities.map((activity, index) => (
    <ClickableTask key={index} taskId={activity.taskId}>
      <ActivityItem>
        <ActivityIcon>
          <Activity size={16} />
        </ActivityIcon>
        <ActivityContent>
          <ActivityTitle>{activity.description}</ActivityTitle>
          <ActivityTime>{new Date(activity.timestamp).toLocaleString()}</ActivityTime>
        </ActivityContent>
      </ActivityItem>
    </ClickableTask>
  ))}
  {dashboardData.recentActivities.length === 0 && (
    <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>
      No recent activities
    </p>
  )}
</ActivityFeed>
      </Content>
    </DashboardContainer>
  );
};

export default PrincipalOfficerDashboard;