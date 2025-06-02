import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 1rem;
`;

const NavItem = styled.li`
  a {
    text-decoration: none;
    color: ${props => props.active ? '#3b82f6' : '#64748b'};
    font-weight: ${props => props.active ? '600' : '500'};
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    transition: all 0.2s;

    &:hover {
      background-color: #f1f5f9;
      color: #3b82f6;
    }
  }
`;

const StaffNavbar = () => {
  const location = useLocation();

  return (
    <Nav>
      <NavList>
        <NavItem active={location.pathname === '/staff/dashboard'}>
          <Link to="/staff/dashboard">Dashboard</Link>
        </NavItem>
        <NavItem active={location.pathname === '/staff/attendance'}>
          <Link to="/staff/attendance">Mark Attendance</Link>
        </NavItem>
        <NavItem active={location.pathname === '/staff/student-logs'}>
          <Link to="/staff/student-logs">Student Logs</Link>
        </NavItem>
      </NavList>
    </Nav>
  );
};

export default StaffNavbar; 