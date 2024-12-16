import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthProvider';
import { 
  FaTachometerAlt, 
  FaTasks, 
  FaFileAlt, 
  FaClipboardList, 
  FaBars, 
  FaSignOutAlt,
  FaComments,
  FaCircle,
  FaUsers
} from 'react-icons/fa';

const SidebarContainer = styled.div`
  width: ${props => (props.isOpen ? '250px' : '60px')};
  height: 100vh;
  background-color: #2c3e50;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease-in-out;
  box-shadow: ${props => props.isOpen ? '2px 0 5px rgba(0, 0, 0, 0.1)' : 'none'};
`;

const SidebarHeader = styled.div`
  padding: 20px;
  font-size: 1.2em;
  background-color: #1a252f;
  display: flex;
  align-items: center;
  justify-content: ${props => props.isOpen ? 'space-between' : 'center'};
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease-in-out;
  
  &:hover {
    background-color: #243342;
  }
`;

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 10px 0;
`;

const SidebarLink = styled(Link)`
  text-decoration: none;
  color: white;
  display: flex;
  align-items: center;
  padding: 12px 20px;
  transition: all 0.2s ease-in-out;
  border-left: 3px solid transparent;

  &:hover {
    background-color: #34495e;
    border-left: 3px solid #3498db;
  }

  &.active {
    background-color: #34495e;
    border-left: 3px solid #3498db;
  }
`;

const SidebarIcon = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  opacity: 0.9;
`;

const SidebarText = styled.span`
  display: ${props => (props.isOpen ? 'inline' : 'none')};
  margin-left: 15px;
  transition: all 0.3s ease-in-out;
  white-space: nowrap;
  opacity: ${props => (props.isOpen ? '1' : '0')};
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s ease-in-out;
  border-left: 3px solid transparent;
  margin-top: auto;

  &:hover {
    background-color: #34495e;
    border-left: 3px solid #e74c3c;
  }
`;

const ChatSection = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
  padding: 10px 0;
`;

const ChatHeader = styled.div`
  padding: 10px 20px;
  font-size: 0.9em;
  color: rgba(255, 255, 255, 0.7);
  display: ${props => (props.isOpen ? 'block' : 'none')};
`;

const ChatUserList = styled.div`
  display: ${props => (props.isOpen ? 'block' : 'none')};
`;

const ChatUser = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 20px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: #34495e;
  }
`;

const UserStatus = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
  
  .status-indicator {
    font-size: 8px;
    margin-right: 5px;
    color: ${props => props.online ? '#2ecc71' : '#95a5a6'};
  }
`;

const MessageCount = styled.span`
  background-color: #e74c3c;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 0.7em;
  margin-left: auto;
  display: ${props => props.count > 0 ? 'block' : 'none'};
`;

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const chatUsers = [
    { id: 1, name: 'John Doe', online: true, unread: 3 },
    { id: 2, name: 'Jane Smith', online: true, unread: 0 },
    { id: 3, name: 'Mike Johnson', online: false, unread: 1 },
  ];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  };

  // Define dashboard route based on user role
  const getDashboardRoute = () => {
    switch (user?.role) {
      case 'deputyDirector':
        return '/admin-dashboard';
      case 'principalOfficer':
        return '/principal-officer-dashboard';
      case 'seniorOfficer':
        return '/senior-officer-dashboard';
      default:
        return '/officer-dashboard';
    }
  };

  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarHeader onClick={toggleSidebar} isOpen={isOpen}>
        <SidebarIcon>
          <FaBars />
        </SidebarIcon>
        <SidebarText isOpen={isOpen}>{user?.role || 'Dashboard'}</SidebarText>
      </SidebarHeader>
      
      <SidebarNav>
        <SidebarLink 
          to={getDashboardRoute()}
          className={location.pathname === getDashboardRoute() ? 'active' : ''}
        >
          <SidebarIcon><FaTachometerAlt /></SidebarIcon>
          <SidebarText isOpen={isOpen}>Dashboard</SidebarText>
        </SidebarLink>

        {/* Only show User Management for Deputy Director (admin) */}
        {user?.role === 'deputyDirector' && (
          <SidebarLink 
            to="/user-management"
            className={location.pathname === '/user-management' ? 'active' : ''}
          >
            <SidebarIcon><FaUsers /></SidebarIcon>
            <SidebarText isOpen={isOpen}>User Management</SidebarText>
          </SidebarLink>
        )}

        <SidebarLink 
          to="/my-tasks"
          className={location.pathname === '/my-tasks' ? 'active' : ''}
        >
          <SidebarIcon><FaTasks /></SidebarIcon>
          <SidebarText isOpen={isOpen}>My Tasks</SidebarText>
        </SidebarLink>

        <SidebarLink 
          to="/complaints"
          className={location.pathname === '/complaints' ? 'active' : ''}
        >
          <SidebarIcon><FaClipboardList /></SidebarIcon>
          <SidebarText isOpen={isOpen}>Complaints</SidebarText>
        </SidebarLink>

        <SidebarLink 
          to="/reports"
          className={location.pathname === '/reports' ? 'active' : ''}
        >
          <SidebarIcon><FaFileAlt /></SidebarIcon>
          <SidebarText isOpen={isOpen}>Reports</SidebarText>
        </SidebarLink>
        
        {/* Chat Section */}
        <ChatSection>
          <SidebarLink 
            to="/messages"
            className={location.pathname === '/messages' ? 'active' : ''}
          >
            <SidebarIcon><FaComments /></SidebarIcon>
            <SidebarText isOpen={isOpen}>Messages</SidebarText>
          </SidebarLink>
          
          <ChatHeader isOpen={isOpen}>
            Online Users ({chatUsers.filter(user => user.online).length})
          </ChatHeader>
          
          <ChatUserList isOpen={isOpen}>
            {chatUsers.map(user => (
              <ChatUser key={user.id}>
                <UserStatus online={user.online}>
                  <FaCircle className="status-indicator" />
                </UserStatus>
                <span>{user.name}</span>
                <MessageCount count={user.unread}>
                  {user.unread}
                </MessageCount>
              </ChatUser>
            ))}
          </ChatUserList>
        </ChatSection>

        <LogoutButton onClick={handleLogout}>
          <SidebarIcon><FaSignOutAlt /></SidebarIcon>
          <SidebarText isOpen={isOpen}>Logout</SidebarText>
        </LogoutButton>
      </SidebarNav>
    </SidebarContainer>
  );
};

export default Sidebar;