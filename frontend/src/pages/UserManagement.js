import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar.js';
import UserForm from '../components/UserForm.js';
import { useAuth } from '../context/AuthProvider.js';
import { API_URL } from '../config/api.js';

const Content = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f1f1f1;
  margin-left: ${props => (props.isSidebarOpen ? '250px' : '60px')};
  transition: margin-left 0.3s;
`;

const WelcomeMessage = styled.div`
  font-size: 24px;
  margin-bottom: 20px;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 16px;

  &:hover {
    background-color: #2980b9;
  }
`;

const UserTable = styled.table`
  width: 100%;
  background-color: white;
  border-radius: 8px;
  border-collapse: collapse;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  background-color: #34495e;
  color: white;
  padding: 15px;
  text-align: left;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const EditButton = styled.button`
  padding: 6px 12px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #27ae60;
  }
`;

const DeleteButton = styled.button`
  padding: 6px 12px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #c0392b;
  }
`;

const NoUsersMessage = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #666;
`;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  // eslint-disable-next-line
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/user-management`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/user-management`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) throw new Error('Failed to create user');
      await fetchUsers();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/user-management/${userData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) throw new Error('Failed to update user');
      await fetchUsers();
      setShowForm(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`${API_URL}/user-management/${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete user');
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
      <Content isSidebarOpen={isSidebarOpen}>
        <WelcomeMessage>
          User Management
          <p>Manage user accounts and permissions.</p>
        </WelcomeMessage>

        <ActionButton onClick={() => {
          setEditingUser(null);
          setShowForm(!showForm);
        }}>
          {showForm ? 'Cancel' : 'Create New User'}
        </ActionButton>

        {showForm && (
          <UserForm
            onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
            initialUser={editingUser}
          />
        )}

        {users.length > 0 ? (
          <UserTable>
            <thead>
              <tr>
                <TableHeader>Username</TableHeader>
                <TableHeader>Role</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <ButtonGroup>
                      <EditButton onClick={() => {
                        setEditingUser(user);
                        setShowForm(true);
                      }}>
                        Edit
                      </EditButton>
                      <DeleteButton onClick={() => handleDeleteUser(user.id)}>
                        Delete
                      </DeleteButton>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </UserTable>
        ) : (
          <NoUsersMessage>No users found.</NoUsersMessage>
        )}
      </Content>
    </div>
  );
};

export default UserManagement;