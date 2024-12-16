// src/components/TaskForm.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addBusinessDays, formatDate, isHoliday } from '../utils/dateUtils.js';
import { isSaturday, isSunday } from 'date-fns';
import Select from 'react-select';
import { API_URL } from '../config/api.js';

const FormContainer = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
`;

const FormField = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 16px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 8px rgba(52, 152, 219, 0.1);
    outline: none;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 8px rgba(52, 152, 219, 0.1);
    outline: none;
  }
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const StyledSelect = styled(Select)`
  .select__control {
    border: 1px solid #ddd;
    border-radius: 6px;
    min-height: 42px;
    background-color: white;

    &:hover {
      border-color: #3498db;
    }
  }

  .select__control--is-focused {
    border-color: #3498db;
    box-shadow: 0 0 8px rgba(52, 152, 219, 0.1);
  }

  .select__menu {
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .select__option {
    padding: 10px 16px;
    
    &--is-focused {
      background-color: #f0f4f8;
    }
    
    &--is-selected {
      background-color: #3498db;
    }
  }
`;

const Button = styled.button`
  padding: 14px 28px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #2980b9;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  background-color: white;
  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 8px rgba(52, 152, 219, 0.1);
    outline: none;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #3498db;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 5px;
  margin-bottom: 5px;
`;

const TaskForm = ({ onSubmit, initialTask }) => {
  const [officers, setOfficers] = useState([]);
  const [task, setTask] = useState({
    id: '',
    name: '',
    description: '',
    deadline: '',
    assignedOfficer: '',
    document: null,
    timeframe: 0,
    collaboration: false,
    collaborators: []
  });
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch officers when component mounts
  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const response = await fetch(`${API_URL}/user-management`);
        if (!response.ok) throw new Error('Failed to fetch officers');
        const data = await response.json();
        
        // Transform users data into format needed for react-select
        const formattedOfficers = data.map(user => ({
          value: user.id,
          label: user.username
        }));
        
        setOfficers(formattedOfficers);
        
        // Set default assigned officer if there are officers and no current assignment
        if (formattedOfficers.length > 0 && !task.assignedOfficer) {
          setTask(prev => ({
            ...prev,
            assignedOfficer: formattedOfficers[0].value
          }));
        }
      } catch (error) {
        console.error('Error fetching officers:', error);
        setErrorMessage('Failed to load officers');
      }
    };

    fetchOfficers();
  }, [task.assignedOfficer]);  // Added the missing dependency


  useEffect(() => {
    if (initialTask) {
      const daysDiff = Math.ceil((new Date(initialTask.deadline) - new Date()) / (1000 * 60 * 60 * 24));
      setTask({
        ...initialTask,
        timeframe: daysDiff,
        collaboration: initialTask.collaborators?.length > 0 || false,
        collaborators: initialTask.collaborators || []
      });
    }
  }, [initialTask]);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    setTask(prevTask => {
      let updatedTask = {
        ...prevTask,
        [name]: type === 'checkbox' ? checked : files ? files[0] : value
      };

      if (name === 'collaboration') {
        if (checked) {
          updatedTask.assignedOfficer = '';
        } else {
          updatedTask.collaborators = [];
          updatedTask.assignedOfficer = officers.length > 0 ? officers[0].value : '';
        }
      }

      return updatedTask;
    });
  };

  const handleTimeframeChange = (e) => {
    const { value } = e.target;
    const timeframe = parseInt(value, 10);
    const deadline = addBusinessDays(new Date(), timeframe);
    setTask(prev => ({
      ...prev,
      timeframe,
      deadline: formatDate(deadline)
    }));
  };

  const handleDateChange = (date) => {
    if (!date) return;

    if (isSaturday(date) || isSunday(date)) {
      setErrorMessage('You cannot set a deadline on a weekend.');
      return;
    }

    const holiday = isHoliday(date);
    if (holiday) {
      setErrorMessage(`You cannot set a deadline on ${holiday}.`);
      return;
    }

    const now = new Date();
    const timeframe = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    setTask(prev => ({
      ...prev,
      timeframe,
      deadline: formatDate(date)
    }));
    setErrorMessage('');
  };

  const handleCollaboratorsChange = (selectedOptions) => {
    setTask(prev => ({
      ...prev,
      collaborators: selectedOptions || [],
      assignedOfficer: prev.collaboration ? 
        selectedOptions?.map(o => o.value).join(', ') : 
        prev.assignedOfficer
    }));
  };

  const handleOfficerChange = (selectedOption) => {
    setTask(prev => ({
      ...prev,
      assignedOfficer: selectedOption ? selectedOption.value : ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (errorMessage) return;

    if (!task.name.trim()) {
      setErrorMessage('Task name is required');
      return;
    }

    if (!task.description.trim()) {
      setErrorMessage('Task description is required');
      return;
    }

    if (!task.deadline) {
      setErrorMessage('Deadline is required');
      return;
    }

    if (!task.collaboration && !task.assignedOfficer) {
      setErrorMessage('Please assign an officer or enable collaboration');
      return;
    }

    if (task.collaboration && (!task.collaborators || task.collaborators.length === 0)) {
      setErrorMessage('Please select at least one collaborator');
      return;
    }

    onSubmit(task);
  };

  return (
    <FormContainer>
      <Title>{task.id ? 'Edit Task' : 'Create New Task'}</Title>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      
      <form onSubmit={handleSubmit}>
        <FormField>
          <Label htmlFor="name">Task Name *</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={task.name}
            onChange={handleChange}
            required
          />
        </FormField>

        <FormField>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            name="description"
            value={task.description}
            onChange={handleChange}
            required
            rows={4}
          />
        </FormField>

        <FormField>
          <Label htmlFor="timeframe">Timeframe (Weekdays) *</Label>
          <Input
            id="timeframe"
            name="timeframe"
            type="number"
            value={task.timeframe}
            onChange={handleTimeframeChange}
            min="1"
            required
          />
        </FormField>

        <FormField>
          <Label htmlFor="deadline">Deadline *</Label>
          <StyledDatePicker
            id="deadline"
            selected={task.deadline ? new Date(task.deadline) : null}
            onChange={handleDateChange}
            minDate={new Date()}
            filterDate={date => {
              const day = date.getDay();
              return day !== 0 && day !== 6 && !isHoliday(date);
            }}
            dateFormat="yyyy-MM-dd"
            required
          />
        </FormField>

        <FormField>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Checkbox
              id="collaboration"
              name="collaboration"
              type="checkbox"
              checked={task.collaboration}
              onChange={handleChange}
            />
            <Label htmlFor="collaboration" style={{ margin: 0 }}>
              Enable Collaboration
            </Label>
          </div>
        </FormField>

        {task.collaboration && (
          <FormField>
            <Label htmlFor="collaborators">Select Collaborators *</Label>
            <StyledSelect
              id="collaborators"
              isMulti
              value={task.collaborators}
              onChange={handleCollaboratorsChange}
              options={officers}
              placeholder="Select collaborators..."
              classNamePrefix="select"
            />
          </FormField>
        )}

        {!task.collaboration && (
          <FormField>
            <Label htmlFor="assignedOfficer">Assigned Officer *</Label>
            <StyledSelect
              id="assignedOfficer"
              value={officers.find(o => o.value === task.assignedOfficer)}
              onChange={handleOfficerChange}
              options={officers}
              isDisabled={task.collaboration}
              placeholder="Select an officer..."
              classNamePrefix="select"
            />
          </FormField>
        )}

        <FormField>
          <Label htmlFor="document">Upload Document</Label>
          <Input
            id="document"
            name="document"
            type="file"
            onChange={handleChange}
          />
        </FormField>

        <Button type="submit">
          {task.id ? 'Update Task' : 'Create Task'}
        </Button>
      </form>
    </FormContainer>
  );
};

export default TaskForm;