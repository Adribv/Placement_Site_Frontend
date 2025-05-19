import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background-color: #f9fafb;
`;

const Sidebar = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: ${props => props.$isOpen ? '250px' : '0'};
  background-color: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-x: hidden;
  transition: width 0.3s ease;
  z-index: 100;
`;

const MainContent = styled.main`
  margin-left: ${props => props.$isOpen ? '250px' : '0'};
  padding: 2rem;
  transition: margin-left 0.3s ease;
`;

const MenuButton = styled.button`
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 1001;
  background: white;
  border: none;
  cursor: pointer;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    color: #2563eb;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const MenuIcon = styled.div`
  width: 18px;
  height: 14px;
  position: relative;
  
  span {
    display: block;
    position: absolute;
    height: 2px;
    width: 100%;
    background: #374151;
    border-radius: 2px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: 0.25s ease-in-out;
    
    &:nth-child(1) {
      top: ${props => props.$isOpen ? '7px' : '0px'};
      transform: ${props => props.$isOpen ? 'rotate(135deg)' : 'rotate(0)'};
    }
    
    &:nth-child(2) {
      top: 7px;
      opacity: ${props => props.$isOpen ? '0' : '1'};
      transform: ${props => props.$isOpen ? 'translateX(20px)' : 'translateX(0)'};
    }
    
    &:nth-child(3) {
      top: ${props => props.$isOpen ? '7px' : '14px'};
      transform: ${props => props.$isOpen ? 'rotate(-135deg)' : 'rotate(0)'};
    }
  }
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: 4rem;
`;

const MenuItem = styled.li`
  padding: 0.5rem 1rem;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
  margin-bottom: 0.25rem;
  transition: all 150ms ease-in-out;
  color: ${props => props.$active ? '#2563eb' : '#4b5563'};

  &:hover {
    background-color: #f3f4f6;
    font-weight: ${props => props.$active ? '500' : 'normal'};
    background-color: ${props => props.$active ? '#eff6ff' : 'transparent'};
  }
  
  &:active {
    background-color: ${props => props.$active ? '#eff6ff' : '#f3f4f6'};
    color: ${props => props.$active ? '#2563eb' : '#1f2937'};
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #dc2626;
  text-decoration: none;
  border-radius: 0.375rem;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #fee2e2;
  }
`;

const AdminLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/students', label: 'Students' },
    { path: '/admin/leaderboard', label: 'Leaderboard' },
    { path: '/admin/bulk-upload', label: 'Bulk Upload' },
    { path: '/admin/scores', label: 'Scores' },
    { path: '/admin/training', label: 'Training' },
    { path: '/admin/staff', label: 'Staff Management' },
  ];

  return (
    <LayoutContainer>
      <MenuButton onClick={() => setIsOpen(!isOpen)}>
        <MenuIcon $isOpen={isOpen}>
          <span></span>
          <span></span>
          <span></span>
        </MenuIcon>
      </MenuButton>

      <Sidebar $isOpen={isOpen}>
        <MenuList>
          {navItems.map((item) => (
            <MenuItem key={item.path}>
              <NavLink
                to={item.path}
                $active={location.pathname === item.path}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </NavLink>
            </MenuItem>
          ))}
          <MenuItem>
            <LogoutButton onClick={handleLogout}>
                Logout
            </LogoutButton>
          </MenuItem>
        </MenuList>
      </Sidebar>

      <MainContent $isOpen={isOpen}>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default AdminLayout;
