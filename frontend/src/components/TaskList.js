import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import { useAuth } from '../context/AuthProvider.js';
import { Search, Clock, User, Link as LinkIcon, AlertCircle, X, FileText, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import { API_URL } from '../config/api.js';

// Styled Components
const StyledTaskList = styled.div`
  min-height: 100vh;
  background: #f7fafc;
`;

const TopBar = styled.div`
  padding: 20px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
`;

const TopContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const MainTitle = styled.h1`
  font-size: 24px;
  color: #1a202c;
  margin-bottom: 8px;
`;

const SubTitle = styled.p`
  color: #718096;
  font-size: 14px;
`;

const MainContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const SearchSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SearchField = styled.input`
  width: 100%;
  padding: 8px 16px 8px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
`;

const TasksGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

const TaskItem = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 16px;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;
`;

const TaskName = styled.h3`
  font-size: 16px;
  color: #2d3748;
  margin: 0;
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'Completed': return '#C6F6D5';
      case 'Pending': return '#FEEBC8';
      case 'In Progress': return '#BEE3F8';
      default: return '#E2E8F0';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Completed': return '#2F855A';
      case 'Pending': return '#C05621';
      case 'In Progress': return '#2B6CB0';
      default: return '#4A5568';
    }
  }};
`;

const TaskContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

const TaskInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4a5568;
  font-size: 14px;

  svg {
    color: #a0aec0;
  }
`;

const TaskDescription = styled.p`
  color: #718096;
  font-size: 14px;
  margin: 12px 0;
  grid-column: 1 / -1;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  ${props => props.primary ? `
    background: #4299e1;
    color: white;
    border: none;

    &:hover {
      background: #3182ce;
    }
  ` : props.danger ? `
    background: #fff;
    color: #e53e3e;
    border: 1px solid #e53e3e;

    &:hover {
      background: #fff5f5;
    }
  ` : `
    background: white;
    color: #4a5568;
    border: 1px solid #e2e8f0;

    &:hover {
      background: #f7fafc;
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  color: #4a5568;
  background: white;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  flex-wrap: wrap;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: ${props => props.active ? '#4299e1' : 'white'};
  color: ${props => props.active ? 'white' : '#4a5568'};
  cursor: pointer;

  &:hover {
    background: ${props => props.active ? '#3182ce' : '#f7fafc'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorAlert = styled.div`
  background: #FED7D7;
  color: #C53030;
  padding: 12px;
  border-radius: 6px;
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
  color: #4299e1;
  font-size: 16px;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #718096;
  font-size: 16px;
`;

Modal.setAppElement('#root');

const ITEMS_PER_PAGE = 5;

const TaskList = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [seniorOfficers, setSeniorOfficers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOfficer, setSelectedOfficer] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tasksResponse, officersResponse] = await Promise.all([
          fetch(`${API_URL}/tasks`),
          fetch(`${API_URL}/senior-officers`)
        ]);

        if (!tasksResponse.ok || !officersResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        let tasksData = await tasksResponse.json();
        const officersData = await officersResponse.json();

        // Filter tasks based on user role
        if (user.role === 'deputyDirector') {
          // Admin sees all tasks
          setTasks(Array.isArray(tasksData) ? tasksData : []);
        } else {
          // Other users only see their assigned tasks
          const userTasks = tasksData.filter(task => {
            const assignees = task.assignedOfficer?.split(', ') || [];
            return assignees.includes(user.username);
          });
          setTasks(Array.isArray(userTasks) ? userTasks : []);
        }

        setSeniorOfficers(Array.isArray(officersData) ? officersData : []);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error('Error fetching data:', err);
        setTasks([]);
        setSeniorOfficers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
      
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
    }
  };

  const delegateTask = async () => {
    if (!selectedOfficer) return;

    try {
      const response = await fetch(`${API_URL}/tasks/${currentTaskId}/delegate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newOfficer: selectedOfficer })
      });

      if (!response.ok) {
        throw new Error('Failed to delegate task');
      }

      const updatedTask = await response.json();
      setTasks(tasks.map(task => 
        task.id === currentTaskId ? updatedTask.task : task
      ));

      setModalIsOpen(false);
      setSelectedOfficer('');
    } catch (err) {
      setError('Failed to delegate task. Please try again.');
      console.error('Error delegating task:', err);
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      doc.setFontSize(16);
      doc.text('Task List Report', pageWidth/2, 15, { align: 'center' });
      
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth/2, 22, { align: 'center' });
      
      doc.setFontSize(12);
      
      let yPos = 30;
      const lineHeight = 7;
      
      filteredTasks.forEach((task, index) => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${task.name || 'Untitled Task'}`, 10, yPos);
        yPos += lineHeight;
        
        doc.setFont('helvetica', 'normal');
        doc.text(`Status: ${task.status || 'No Status'}`, 15, yPos);
        yPos += lineHeight;
        
        doc.text(`Assigned to: ${task.assignedOfficer || 'Unassigned'}`, 15, yPos);
        yPos += lineHeight;
        
        doc.text(`Deadline: ${task.deadline || 'No Deadline'}`, 15, yPos);
        yPos += lineHeight;
        
        const description = task.description || 'No description available';
        const descriptionLines = doc.splitTextToSize(description, pageWidth - 30);
        doc.text(descriptionLines, 15, yPos);
        yPos += (lineHeight * descriptionLines.length) + 5;
      });
      
      doc.save('tasks.pdf');
    } catch (err) {
      setError('Failed to export PDF. Please try again.');
      console.error('Error exporting PDF:', err);
    }
  };

  const exportToCSV = () => {
    try {
      const headers = ['Name', 'Status', 'Assigned Officer', 'Deadline', 'Description'];
      const csvContent = [
        headers.join(','),
        ...filteredTasks.map(task => [
          `"${(task.name || '').replace(/"/g, '""')}"`,
          task.status || '',
          task.assignedOfficer || '',
          task.deadline || '',
          `"${(task.description || '').replace(/"/g, '""')}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'tasks.csv';
      link.click();
    } catch (err) {
      setError('Failed to export CSV. Please try again.');
      console.error('Error exporting CSV:', err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (!task || typeof task !== 'object') return false;

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' || [
      task?.name,
      task?.description,
      task?.assignedOfficer
    ].some(field => 
      typeof field === 'string' && field.toLowerCase().includes(searchLower)
    );

    const matchesStatus = filterStatus === 'all' || task?.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <StyledTaskList>
        <TopBar>
          <TopContent>
            <MainTitle>Loading tasks...</MainTitle>
          </TopContent>
        </TopBar>
        <LoadingSpinner>Loading...</LoadingSpinner>
      </StyledTaskList>
    );
  }

  return (
    <StyledTaskList>
      <TopBar>
        <TopContent>
          <MainTitle>Task Management</MainTitle>
          <SubTitle>View and manage all assigned tasks</SubTitle>
        </TopContent>
      </TopBar>

      <MainContainer>
        {error && (
          <ErrorAlert>
            <AlertCircle size={20} />
            {error}
          </ErrorAlert>
        )}

        <SearchSection>
          <SearchWrapper>
            <IconWrapper>
              <Search size={20} />
            </IconWrapper>
            <SearchField
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </SearchWrapper>

          <Select value={filterStatus} onChange={handleStatusFilter}>
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Select>

          <Button onClick={exportToPDF}>
            <FileText size={16} />
            Export PDF
          </Button>

          <Button onClick={exportToCSV}>
            <Download size={16} />
            Export CSV
          </Button>
        </SearchSection>

        {paginatedTasks.length === 0 ? (
          <NoDataMessage>
            {searchTerm || filterStatus !== 'all' 
              ? 'No tasks found matching your search criteria.' 
              : 'No tasks available.'}
          </NoDataMessage>
        ) : (
          <TasksGrid>
            {paginatedTasks.map((task) => (
              <TaskItem key={task.id}>
                <TaskHeader>
                  <TaskName>{task?.name || 'Untitled Task'}</TaskName>
                  <StatusBadge status={task?.status}>{task?.status || 'No Status'}</StatusBadge>
                </TaskHeader>
                
                <TaskDescription>{task?.description || 'No description available'}</TaskDescription>

                <TaskContent>
                  <TaskInfo>
                    <Clock size={16} />
                    Deadline: {task?.deadline || 'No deadline set'}
                  </TaskInfo>
                  <TaskInfo>
                    <User size={16} />
                    Assigned to: {task?.assignedOfficer || 'Unassigned'}
                  </TaskInfo>
                  {task?.link && (
                    <TaskInfo>
                      <LinkIcon size={16} />
                      <a href={task.link} target="_blank" rel="noopener noreferrer">
                        View Resource
                      </a>
                    </TaskInfo>
                  )}
                </TaskContent>

                <ActionButtons>
                  {user?.role === 'principalOfficer' && 
                   task?.assignedOfficer === user?.username && (
                    <Button primary onClick={() => {
                      setCurrentTaskId(task.id);
                      setModalIsOpen(true);
                    }}>
                      Delegate Task
                    </Button>
                  )}
                  {user?.role === 'deputyDirector' && (
                    <Button danger onClick={() => deleteTask(task.id)}>
                      Delete Task
                    </Button>
                  )}
                </ActionButtons>
              </TaskItem>
            ))}
          </TasksGrid>
        )}

        {totalPages > 1 && (
          <PaginationContainer>
            <PageButton
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </PageButton>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <PageButton
                key={page}
                active={currentPage === page}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </PageButton>
            ))}
            
            <PageButton
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </PageButton>
          </PaginationContainer>
        )}

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              padding: '24px',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '90%'
            },
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }
          }}
        >
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '18px', color: '#1a202c' }}>Delegate Task</h2>
            <Button onClick={() => setModalIsOpen(false)} style={{ padding: '4px' }}>
              <X size={20} />
            </Button>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontSize: '14px' }}>
              Select Senior Officer
            </label>
            <Select
              value={selectedOfficer}
              onChange={(e) => setSelectedOfficer(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">Choose an officer</option>
              {seniorOfficers.map((officer) => (
                <option key={officer.id} value={officer.id}>
                  {officer.name}
                </option>
              ))}
            </Select>
          </div>

          <ActionButtons>
            <Button onClick={() => setModalIsOpen(false)}>
              Cancel
            </Button>
            <Button primary onClick={delegateTask} disabled={!selectedOfficer}>
              Confirm Delegation
            </Button>
          </ActionButtons>
        </Modal>
      </MainContainer>
    </StyledTaskList>
  );
};

export default TaskList;