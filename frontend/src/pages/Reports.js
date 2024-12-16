import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.js';
import { BarChart2, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { API_URL } from '../config/api.js';

const WelcomeSection = styled.div`
  margin-bottom: 30px;
`;

const WelcomeTitle = styled.h1`
  font-size: 32px;
  color: #1a202c;
  margin-bottom: 8px;
`;

const WelcomeText = styled.p`
  color: #718096;
  font-size: 14px;
`;

const SearchSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  h3 {
    font-size: 14px;
    color: #718096;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .number {
    font-size: 32px;
    font-weight: 600;
    color: #1a202c;
  }

  .subtext {
    font-size: 14px;
    color: ${props => props.isPositive ? '#48bb78' : '#718096'};
    margin-top: 4px;
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const TableTitle = styled.h2`
  font-size: 18px;
  color: #1a202c;
`;

const Controls = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.primary ? `
    background: #4299e1;
    color: white;
    border: none;
    
    &:hover {
      background: #3182ce;
    }
  ` : `
    background: white;
    color: #4299e1;
    border: 1px solid #4299e1;
    
    &:hover {
      background: #ebf8ff;
    }
  `}
`;

const Select = styled.select`
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  color: #4a5568;
  cursor: pointer;
  background: white;
  
  &:hover {
    border-color: #4299e1;
  }

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 1px #4299e1;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  font-size: 14px;
  color: #718096;
  border-bottom: 2px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 12px;
  font-size: 14px;
  color: #4a5568;
  border-bottom: 1px solid #e2e8f0;
`;

const Tr = styled.tr`
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f7fafc;
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: #ebf8ff;
  color: #4299e1;
`;

const Reports = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [fiscalYears, setFiscalYears] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_URL}/tasks`);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();
        setTasks(data);
        setFilteredTasks(data);
        calculateFiscalYears(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  const calculateFiscalYears = (tasks) => {
    const years = new Set();
    tasks.forEach(task => {
      const date = new Date(task.assignedAt);
      const fiscalYearStart = date.getMonth() >= 6 ? date.getFullYear() + 1 : date.getFullYear();
      years.add(fiscalYearStart);
    });
    const sortedYears = Array.from(years).sort();
    const fiscalYearOptions = sortedYears.map(year => `${year}-${year + 1}`);

    const startYear = 2024;
    const endYear = Math.max(...sortedYears);
    for (let year = startYear; year <= endYear; year++) {
      if (!years.has(year)) {
        fiscalYearOptions.push(`${year}-${year + 1}`);
      }
    }
    fiscalYearOptions.sort();

    setFiscalYears(fiscalYearOptions);
  };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredTasks(tasks);
      return;
    }

    const filtered = tasks.filter(task => 
      task.name.toLowerCase().includes(term.toLowerCase()) ||
      task.id.toString().includes(term)
    );
    setFilteredTasks(filtered);
  };

  const sortAlphabetically = () => {
    const sortedTasks = [...filteredTasks].sort((a, b) => 
      a.name.localeCompare(b.name)
    );
    setFilteredTasks(sortedTasks);
  };

  const handleFiscalYearChange = (event) => {
    const fiscalYear = event.target.value;
    if (fiscalYear) {
      const [startYear, endYear] = fiscalYear.split('-').map(Number);
      const filtered = tasks.filter(task => {
        const date = new Date(task.assignedAt);
        const taskYear = date.getFullYear();
        const taskMonth = date.getMonth();
        if (taskMonth >= 6) {
          return taskYear + 1 === endYear;
        } else {
          return taskYear === startYear;
        }
      });
      setFilteredTasks(filtered);
    }
  };

  const handleRowClick = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  const getTaskStats = () => {
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      pending: tasks.filter(t => t.status === 'pending').length,
      notStarted: tasks.filter(t => !t.status || t.status === 'not_started').length
    };
  };

  const stats = getTaskStats();

  return (
    <DashboardLayout>
      <WelcomeSection>
        <WelcomeTitle>Reports Overview</WelcomeTitle>
        <WelcomeText>Track and manage your task reports efficiently.</WelcomeText>
      </WelcomeSection>

      <SearchSection>
        <SearchInput 
          type="text" 
          placeholder="Search tasks by name or assigned officer..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <Button primary>
          Export
        </Button>
      </SearchSection>

      <StatsGrid>
        <StatCard>
          <h3><BarChart2 size={16} /> Total Tasks</h3>
          <div className="number">{stats.total}</div>
          <div className="subtext">Tasks in system</div>
        </StatCard>
        <StatCard>
          <h3><CheckCircle size={16} /> Completed</h3>
          <div className="number">{stats.completed}</div>
          <div className="subtext isPositive">
            {((stats.completed / stats.total) * 100).toFixed(1)}% completion rate
          </div>
        </StatCard>
        <StatCard>
          <h3><Clock size={16} /> Pending</h3>
          <div className="number">{stats.pending}</div>
          <div className="subtext">Awaiting completion</div>
        </StatCard>
        <StatCard>
          <h3><AlertTriangle size={16} /> Not Started</h3>
          <div className="number">{stats.notStarted}</div>
          <div className="subtext">Require attention</div>
        </StatCard>
      </StatsGrid>

      <TableContainer>
        <TableHeader>
          <TableTitle>Tasks List</TableTitle>
          <Controls>
            <Button onClick={sortAlphabetically}>
              Sort Alphabetically
            </Button>
            <Select onChange={handleFiscalYearChange} defaultValue="">
              <option value="" disabled>Select Fiscal Year</option>
              {fiscalYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Select>
          </Controls>
        </TableHeader>

        <Table>
          <thead>
            <tr>
              <Th>NO</Th>
              <Th>TASK ID</Th>
              <Th>TASK NAME</Th>
              <Th>DATE ASSIGNED</Th>
              <Th>STATUS</Th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task, index) => (
              <Tr key={task.id} onClick={() => handleRowClick(task.id)}>
                <Td>{index + 1}</Td>
                <Td>{task.id}</Td>
                <Td>{task.name}</Td>
                <Td>{new Date(task.assignedAt).toLocaleDateString()}</Td>
                <Td><StatusBadge>Assigned</StatusBadge></Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </DashboardLayout>
  );
};

export default Reports;