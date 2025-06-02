import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import AttendanceTable from '../shared/AttendanceTable';

const Container = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 2rem;
`;

const StudentInfo = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 0.5rem;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #475569;
  min-width: 120px;
`;

const InfoValue = styled.span`
  color: #1a1a1a;
`;

const Button = styled.button`
  background: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 1rem;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    background: #93c5fd;
    cursor: not-allowed;
  }
`;

const StudentDashboard = ({ studentId }) => {
  const [student, setStudent] = useState(null);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creatingTestData, setCreatingTestData] = useState(false);

  useEffect(() => {
    if (studentId) {
      console.log('StudentDashboard mounted with studentId:', studentId);
      fetchStudentDetails();
      fetchAttendanceLogs();
    }
  }, [studentId]);

  const fetchStudentDetails = async () => {
    try {
      console.log('Fetching student details from:', `${API_ENDPOINTS.ADMIN.STUDENTS}/${studentId}`);
      const response = await axios.get(`${API_ENDPOINTS.ADMIN.STUDENTS}/${studentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      console.log('Student details response:', response.data);
      setStudent(response.data.data);
    } catch (err) {
      console.error('Error fetching student details:', err.response || err);
      setError('Failed to fetch student details');
    }
  };

  const fetchAttendanceLogs = async () => {
    try {
      setLoading(true);
      const url = `${API_ENDPOINTS.ADMIN.STUDENT_ATTENDANCE}/${studentId}`;
      console.log('Fetching attendance from URL:', url);
      console.log('Using token:', localStorage.getItem('adminToken'));

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      console.log('Raw attendance response:', response);
      console.log('Attendance data:', response.data);

      if (response.data?.data) {
        const sortedLogs = response.data.data.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        console.log('Sorted attendance logs:', sortedLogs);
        setAttendanceLogs(sortedLogs);
      } else {
        console.log('No attendance data found in response');
        setAttendanceLogs([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching attendance logs:', err.response || err);
      setError(err.response?.data?.message || 'Failed to fetch attendance logs');
      setAttendanceLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const createTestData = async () => {
    try {
      setCreatingTestData(true);
      const url = `${API_ENDPOINTS.ADMIN.CREATE_TEST_DATA}/${studentId}`;
      console.log('Creating test data for student:', studentId);
      
      const response = await axios.post(url, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      console.log('Test data created:', response.data);
      await fetchAttendanceLogs(); // Refresh attendance logs
    } catch (err) {
      console.error('Error creating test data:', err.response || err);
      setError('Failed to create test data');
    } finally {
      setCreatingTestData(false);
    }
  };

  if (!studentId) {
    return <Container>Please select a student to view details.</Container>;
  }

  return (
    <Container>
      <Title>Student Dashboard</Title>
      
      {student && (
        <StudentInfo>
          <InfoRow>
            <InfoLabel>Name:</InfoLabel>
            <InfoValue>{student.name}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Roll Number:</InfoLabel>
            <InfoValue>{student.regNo}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Email:</InfoLabel>
            <InfoValue>{student.email}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Batch:</InfoLabel>
            <InfoValue>{student.batch}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Department:</InfoLabel>
            <InfoValue>{student.department}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Location:</InfoLabel>
            <InfoValue>{student.location}</InfoValue>
          </InfoRow>
        </StudentInfo>
      )}

      <Button 
        onClick={createTestData} 
        disabled={creatingTestData}
      >
        {creatingTestData ? 'Creating Test Data...' : 'Create Test Attendance Data'}
      </Button>

      <AttendanceTable 
        attendanceLogs={attendanceLogs}
        loading={loading}
        error={error || undefined}
        showStudentName={false}
        showModuleTitle={true}
        showDate={true}
        showRemarks={true}
      />
    </Container>
  );
};

export default StudentDashboard; 