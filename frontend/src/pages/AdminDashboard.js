import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider.js';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar.js';
import TaskForm from '../components/TaskForm.js';
import Clock from '../components/Clock.js';
import { API_URL } from '../config/api.js';
import { 
  BarChart3, 
  Clock as ClockIcon, 
  AlertTriangle,
  Edit2,
  Trash2,
  Plus,
  CheckCircle,
  Search,
  Filter,
  ChevronDown,
  Download,
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
  position: relative;

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

const FilterButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background-color: #f8fafc;
    border-color: #cbd5e1;
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
const ActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: stretch;
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  color: white;
  background-color: ${props => props.variant === 'secondary' ? '#64748b' : '#3b82f6'};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: ${props => props.fullWidth ? '100%' : 'auto'};

  &:hover {
    background-color: ${props => props.variant === 'secondary' ? '#475569' : '#2563eb'};
  }

  @media (max-width: 768px) {
    flex: 1;
  }
`;

const TasksContainer = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TasksHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const TaskTableWrapper = styled.div`
  overflow-x: auto;
  min-height: 400px;
`;

const TaskTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 16px;
`;

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

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background-color: ${props => props.variant === 'edit' ? '#10b981' : '#ef4444'};
  cursor: pointer;
  margin-right: ${props => props.variant === 'edit' ? '8px' : '0'};
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.variant === 'edit' ? '#059669' : '#dc2626'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

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

const AdminDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (Array.isArray(tasks)) {
      const searchTermLower = (searchTerm || '').toLowerCase();
      const filtered = tasks.filter(task => {
        if (!task) return false;
        
        const nameMatch = task.name ? task.name.toLowerCase().includes(searchTermLower) : false;
        const officerMatch = task.assignedOfficer ? task.assignedOfficer.toLowerCase().includes(searchTermLower) : false;
        
        return nameMatch || officerMatch;
      });
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks([]);
    }
  }, [searchTerm, tasks]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      // Ensure we're setting an array
      setTasks(Array.isArray(data) ? data : []);
      setFilteredTasks(Array.isArray(data) ? data : []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
      setFilteredTasks([]);
      setIsLoading(false);
    }
  };

  const calculateStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'Completed').length;
    const pending = tasks.filter(task => task.status === 'Pending').length;
    const notDone = tasks.filter(task => task.status === 'Not Done').length;
    
    return {
      total,
      completed,
      pending,
      notDone,
      completionRate: total ? ((completed / total) * 100).toFixed(1) : 0
    };
  };

  const stats = calculateStats();

  // Existing functions remain the same
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  
  const handleCreateTask = (task) => {
    const formData = new FormData();
    formData.append('name', task.name);
    formData.append('description', task.description);
    formData.append('deadline', task.deadline);
    formData.append('assignedOfficer', task.assignedOfficer);
    if (task.document) {
      formData.append('document', task.document);
    }

    if (task.id) {
      fetch(`${API_URL}/tasks/${task.id}`, {
        method: 'PUT',
        body: formData
      })
        .then(response => response.json())
        .then(updatedTask => {
          setTasks(prevTasks => 
            prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t)
          );
          setShowTaskForm(false);
          setEditingTask(null);
        })
        .catch(error => console.error('Error updating task:', error));
      } else {
        fetch(`${API_URL}/tasks`, {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          setTasks(prevTasks => [...prevTasks, data]);
          setShowTaskForm(false);
        })
        .catch(error => console.error('Error creating task:', error));
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to delete task');
          }
          return response.json();
        })
        .then(() => {
          setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        })
        .catch(error => console.error('Error deleting task:', error));
    }
  };

  const handleTaskClick = (task) => {
    navigate(`/tasks/${task.id}`);
  };

  const toggleTaskForm = () => {
    setShowTaskForm(!showTaskForm);
    setEditingTask(null);
  };

  const formatUsername = (username) => {
    return username
      ?.replace(/([a-z])([A-Z])/g, '$1 $2')
      ?.replace(/([0-9])/g, ' $1')
      ?.replace(/^./, str => str.toUpperCase());
  };

  return (
    <DashboardContainer>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Content isSidebarOpen={isSidebarOpen}>
        <TopSection>
          <Clock />
          
          <WelcomeMessage>
            Welcome back, {user ? formatUsername(user.username) : 'Admin'}
            <p>We're delighted to have you. Need help with the system? Navigate to virtual assistant on the side menu.</p>
          </WelcomeMessage>

          <SearchSection>
            <SearchBar>
              <SearchIcon size={20} />
              <SearchInput
                type="text"
                placeholder="Search tasks by name or assigned officer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBar>
            <ButtonGroup>
              <FilterButton>
                <Filter size={20} />
                Filter
                <ChevronDown size={16} />
              </FilterButton>
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
                <BarChart3 size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>{stats.total}</StatValue>
            <StatChange>Tasks in system</StatChange>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatTitle>Completed</StatTitle>
              <StatIcon bg="#dcfce7" color="#10b981">
                <CheckCircle size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>{stats.completed}</StatValue>
            <StatChange increase>{stats.completionRate}% completion rate</StatChange>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatTitle>Pending</StatTitle>
              <StatIcon bg="#fef3c7" color="#f59e0b">
                <ClockIcon size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>{stats.pending}</StatValue>
            <StatChange>Awaiting completion</StatChange>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatTitle>Not Started</StatTitle>
              <StatIcon bg="#fee2e2" color="#ef4444">
                <AlertTriangle size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>{stats.notDone}</StatValue>
            <StatChange>Require attention</StatChange>
          </StatCard>
        </StatsGrid>

        <Button onClick={toggleTaskForm}>
          <Plus size={20} />
          {showTaskForm ? 'Hide Task Form' : 'Create New Task'}
        </Button>

        {showTaskForm && (
          <TaskForm
            officers={[
              { id: 1, name: 'Principal Officer 1' },
              { id: 2, name: 'Principal Officer 2' },
              { id: 3, name: 'Principal Officer 3' },
              { id: 4, name: 'Principal Officer 4' },
              { id: 5, name: 'Principal Officer 5' },
              { id: 6, name: 'Senior Officer 1' },
              { id: 7, name: 'Senior Officer 2' },
              { id: 8, name: 'Senior Officer 3' },
              { id: 9, name: 'Senior Officer 4' },
              { id: 10, name: 'Senior Officer 5' },
            ]}
            onSubmit={handleCreateTask}
            initialTask={editingTask}
          />
        )}

        <TasksContainer>
          <TasksHeader>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>
              Tasks List
            </h2>
          </TasksHeader>

          <TaskTableWrapper>
            {isLoading ? (
              <LoadingSpinner>Loading tasks...</LoadingSpinner>
            ) : filteredTasks.length > 0 ? (
              <TaskTable>
                <thead>
                  <tr>
                    <TaskTableHeader>S/No</TaskTableHeader>
                    <TaskTableHeader>TASK ID</TaskTableHeader>
                    <TaskTableHeader>TASK NAME</TaskTableHeader>
                    <TaskTableHeader>STATUS</TaskTableHeader>
                    <TaskTableHeader>DEADLINE</TaskTableHeader>
                    <TaskTableHeader>ASSIGNED TO</TaskTableHeader>
                    <TaskTableHeader>ACTIONS</TaskTableHeader>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task, index) => (
                    <TaskRow 
                      key={task.id} 
                      onClick={() => handleTaskClick(task)}
                    >
                      <TaskCell>{index + 1}</TaskCell>
                      <TaskCell>{task.id}</TaskCell>
                      <TaskCell>{task.name}</TaskCell>
                      <TaskCell>
                        <StatusBadge status={task.status}>
                          {task.status}
                        </StatusBadge>
                      </TaskCell>
                      <TaskCell>{task.deadline}</TaskCell>
                      <TaskCell>
                        {task.collaborators && task.collaborators.length > 0 
                          ? task.collaborators.join(', ') 
                          : task.assignedOfficer}
                      </TaskCell>
                      <TaskCell onClick={(e) => e.stopPropagation()}>
                        <ActionButton 
                          variant="edit" 
                          onClick={(e) => { 
                            e.stopPropagation();
                            handleEditTask(task);
                          }}
                        >
                          <Edit2 size={16} />
                          Edit
                        </ActionButton>
                        <ActionButton 
                          variant="delete" 
                          onClick={(e) => { 
                            e.stopPropagation();
                            handleDeleteTask(task.id);
                          }}
                        >
                          <Trash2 size={16} />
                          Delete
                        </ActionButton>
                      </TaskCell>
                    </TaskRow>
                  ))}
                </tbody>
              </TaskTable>
            ) : (
              <NoTasksMessage>
                <h3>No Tasks Found</h3>
                <p>There are no tasks matching your search criteria.</p>
                {!searchTerm && (
                  <img 
                    src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTFiNzVicXh1dHp2aWd3YnE4amZjcnIzdWl2NnBmY3h4engyOTN6ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26ufnwz3wDUli7GU0/giphy.webp" 
                    alt="No tasks" 
                  />
                )}
              </NoTasksMessage>
            )}
          </TaskTableWrapper>
        </TasksContainer>
      </Content>
    </DashboardContainer>
  );
};

export default AdminDashboard;