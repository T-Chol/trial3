import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const FormContainer = styled.form`
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
`;

const UserForm = ({ onSubmit, initialUser = null }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'seniorOfficer',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialUser) {
      setFormData({
        username: initialUser.username || '',
        password: '', // Don't populate password on edit
        role: initialUser.role || 'seniorOfficer',
      });
    }
  }, [initialUser]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!initialUser && !formData.password) {
      newErrors.password = 'Password is required for new users';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        // Only include password if it's provided or it's a new user
        ...(formData.password || !initialUser ? { password: formData.password } : {})
      };

      await onSubmit(submitData);
      // Reset form if it's not an edit
      if (!initialUser) {
        setFormData({
          username: '',
          password: '',
          role: 'seniorOfficer',
        });
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Error submitting form'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="username">Username</Label>
        <Input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter username"
        />
        {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder={initialUser ? "Leave blank to keep current password" : "Enter password"}
        />
        {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="role">Role</Label>
        <Select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="admin">Admin</option>
          <option value="principalOfficer">Principal Officer</option>
          <option value="seniorOfficer">Senior Officer</option>
        </Select>
        {errors.role && <ErrorMessage>{errors.role}</ErrorMessage>}
      </FormGroup>

      {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : initialUser ? 'Update User' : 'Create User'}
      </Button>
    </FormContainer>
  );
};

export default UserForm;