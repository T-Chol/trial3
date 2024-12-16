// src/context/AuthProvider.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  const login = (username, role) => {
    const newUser = { username, role };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);

    switch(role) {
      case 'deputyDirector':
        navigate('/admin-dashboard');
        break;
      case 'principalOfficer':
        navigate('/principal-officer-dashboard');
        break;
      case 'seniorOfficer':
        navigate('/senior-officer-dashboard');
        break;
      default:
        navigate('/officer-dashboard');
        break;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
