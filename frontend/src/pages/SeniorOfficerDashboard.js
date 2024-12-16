import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider.js';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar.js';
import Clock from '../components/Clock.js';
import ClickableTask from '../components/ClickableTask.js';
import { API_URL } from '../config/api.js';

import { 
  ClipboardList, 
  Clock as ClockIcon, 
  AlertTriangle,
  Search,
  Filter,
  Download,
  ChevronDown,
  Activity,
  CheckCircle
} from 'lucide-react';

// Styled Components
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

const SearchIcon = styled(Search)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.variant === 'secondary' ? '#64748b' : 'white'};
  background-color: ${props => props.variant === 'secondary' ? 'white' : '#3b82f6'};
  border: ${props => props.variant === 'secondary' ? '1px solid #e2e8f0' : 'none'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.variant === 'secondary' ? '#f8fafc' : '#2563eb'};
  }

  @media (max-width: 768px) {
    flex: 1;
  }
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
// eslint-disable-next-line
const TasksContainer = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;
// eslint-disable-next-line
const TasksHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
// eslint-disable-next-line
const TaskTableWrapper = styled.div`
  overflow-x: auto;
`;
// eslint-disable-next-line
const TaskTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 16px;
`;
// eslint-disable-next-line
const TaskTableHeader = styled.th`
  background-color: #f8fafc;
  color: #475569;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;

  &:first-child {
    padding-left: 24px;
  }

  &:last-child {
    padding-right: 24px;
  }
`;
// eslint-disable-next-line
const TaskRow = styled.tr`
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  &:last-child td {
    border-bottom: none;
  }
`;
// eslint-disable-next-line
const TaskCell = styled.td`
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #1e293b;
  vertical-align: middle;

  &:first-child {
    padding-left: 24px;
  }

  &:last-child {
    padding-right: 24px;
  }
`;
// eslint-disable-next-line
const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 600;
  background-color: ${props => {
    switch (props.status) {
      case 'Not Done': return '#fee2e2';
      case 'Pending': return '#fef3c7';
      case 'Completed': return '#dcfce7';
      case 'Assigned': return '#dbeafe';
      default: return '#f1f5f9';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Not Done': return '#991b1b';
      case 'Pending': return '#92400e';
      case 'Completed': return '#166534';
      case 'Assigned': return '#1e40af';
      default: return '#475569';
    }
  }};
`;
// eslint-disable-next-line
const NoTasksMessage = styled.div`
  text-align: center;
  padding: 48px 20px;
  color: #64748b;

  h3 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #1e293b;
  }

  p {
    font-size: 16px;
    margin-bottom: 24px;
  }

  img {
    margin-top: 24px;
    width: 100%;
    max-width: 300px;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: #3b82f6;
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


const SeniorOfficerDashboard = () => {
  const { user } = useAuth();
  // eslint-disable-next-line
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalTasks: 0,
      completed: 0,
      inProgress: 0,
      pending: 0
    },
    recentActivities: [],
    upcomingDeadlines: []
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/tasks`);

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const tasksData = await response.json();

      // Filter tasks for current Senior Officer
      const userTasks = tasksData.filter(task => {
        const assignees = task.assignedOfficer?.split(', ') || [];
        return assignees.includes(user.username);
      });

      // Calculate statistics
      const stats = {
        totalTasks: userTasks.length,
        completed: userTasks.filter(task => task.status === 'Completed').length,
        inProgress: userTasks.filter(task => task.status === 'In Progress').length,
        pending: userTasks.filter(task => task.status === 'Pending').length
      };

      // Get activities from tasks
      const recentActivities = userTasks
        .map(task => ({
          taskId: task.id,
          description: `Task "${task.name}" - ${task.status}`,
          timestamp: task.deadline
        }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);

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
  };

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
          <div style={{ color: '#ef4444', padding: '12px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <TopSection>
          <Clock />
          <WelcomeMessage>
            Welcome back, {formatUsername(user?.username)}
            <p>View and track your assigned tasks and their progress</p>
          </WelcomeMessage>

          <SearchSection>
            <SearchBar>
              <SearchIcon size={20} />
              <SearchInput
                type="text"
                placeholder="Search tasks by name or assignee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBar>
            <ButtonGroup>
              <Button variant="secondary">
                <Filter size={20} />
                Filter
                <ChevronDown size={16} />
              </Button>
              <Button variant="secondary">
                <Download size={20} />
                Export
              </Button>
            </ButtonGroup>
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
              <StatTitle>Completed</StatTitle>
              <StatIcon bg="#dcfce7" color="#10b981">
                <CheckCircle size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>{dashboardData.stats.completed}</StatValue>
            <StatChange increase>
              {((dashboardData.stats.completed / dashboardData.stats.totalTasks) * 100).toFixed(1)}% complete
            </StatChange>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatTitle>In Progress</StatTitle>
              <StatIcon bg="#fef3c7" color="#f59e0b">
                <ClockIcon size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>{dashboardData.stats.inProgress}</StatValue>
            <StatChange>Active tasks</StatChange>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatTitle>Pending</StatTitle>
              <StatIcon bg="#fee2e2" color="#ef4444">
                <AlertTriangle size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>{dashboardData.stats.pending}</StatValue>
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

export default SeniorOfficerDashboard;