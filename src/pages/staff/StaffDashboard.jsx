import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import StaffStudentAttendance from '../components/staff/StaffStudentAttendance';
import StudentLogDetails from '../components/staff/StudentLogDetails';

const Container = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 2rem;
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
`;

const StudentList = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-height: 80vh;
  overflow-y: auto;
`;

const StudentItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  ${props => props.selected && `
    background-color: #f1f5f9;
    border-left: 4px solid #3b82f6;
  `}
`;

const StudentName = styled.div`
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
`;

const StudentRoll = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
`;

const ViewLogsButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  width: 100%;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2563eb;
  }
`;

const TabContainer = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
`;

const TabButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background: ${props => props.active ? '#3b82f6' : '#f1f5f9'};
  color: ${props => props.active ? 'white' : '#475569'};
  font-weight: 500;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#2563eb' : '#e2e8f0'};
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748b;
`;

const ErrorText = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ef4444;
`;

const StaffDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('attendance');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.STAFF.STUDENTS, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('staffToken')}`
        }
      });
      setStudents(response.data.data || []);
      setErrorMessage(null);
    } catch (err) {
      console.error('Error fetching students:', err);
      setErrorMessage('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleViewLogs = (student) => {
    setSelectedStudent(student);
    setActiveTab('logs');
  };

  if (loading) {
    return <LoadingText>Loading students...</LoadingText>;
  }

  if (errorMessage) {
    return <ErrorText>{errorMessage}</ErrorText>;
  }

  return (
    <Container>
      <Title>Staff Dashboard</Title>
      
      <ContentContainer>
        <StudentList>
          <h3 style={{ marginBottom: '1rem' }}>Students</h3>
          {students.map(student => (
            <StudentItem 
              key={student._id}
              selected={selectedStudent?._id === student._id}
            >
              <StudentName>{student.name}</StudentName>
              <StudentRoll>{student.rollNumber}</StudentRoll>
              <ViewLogsButton 
                onClick={() => handleViewLogs(student)}
                type="button"
              >
                View Logs
              </ViewLogsButton>
            </StudentItem>
          ))}
          {students.length === 0 && (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#64748b' }}>
              No students found
            </div>
          )}
        </StudentList>

        <div>
          {selectedStudent ? (
            <>
              <TabContainer>
                <TabButton 
                  active={activeTab === 'attendance'} 
                  onClick={() => setActiveTab('attendance')}
                >
                  Attendance
                </TabButton>
                <TabButton 
                  active={activeTab === 'logs'} 
                  onClick={() => setActiveTab('logs')}
                >
                  Activity Logs
                </TabButton>
              </TabContainer>

              {activeTab === 'attendance' ? (
                <StaffStudentAttendance studentId={selectedStudent._id} />
              ) : (
                <StudentLogDetails studentId={selectedStudent._id} />
              )}
            </>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              background: 'white',
              borderRadius: '1rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              Select a student to view their details
            </div>
          )}
        </div>
      </ContentContainer>
    </Container>
  );
};

export default StaffDashboard; 