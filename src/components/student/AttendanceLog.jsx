import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const AttendanceContainer = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  color: #475569;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'present':
        return '#dcfce7';
      case 'absent':
        return '#fee2e2';
      case 'late':
        return '#fef3c7';
      default:
        return '#e2e8f0';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'present':
        return '#166534';
      case 'absent':
        return '#991b1b';
      case 'late':
        return '#92400e';
      default:
        return '#475569';
    }
  }};
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

const Button = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  margin-bottom: 1rem;
  &:hover {
    background-color: #2563eb;
  }
`;

const AttendanceLog = () => {
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAttendanceLogs();
  }, []);

  const createTestData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        API_ENDPOINTS.STUDENT.CREATE_TEST_DATA,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('studentToken')}`
          }
        }
      );
      console.log('Test data created:', response.data);
      fetchAttendanceLogs(); // Refresh the attendance logs
    } catch (err) {
      console.error('Error creating test data:', err);
      setError('Failed to create test data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('studentToken');
      console.log('Using token:', token); // Debug log

      const response = await axios.get(API_ENDPOINTS.STUDENT.ATTENDANCE, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('API Response:', response.data); // Debug log

      if (response.data?.data) {
        // Sort by date, most recent first
        const sortedLogs = response.data.data.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        
        setAttendanceLogs(sortedLogs);
        setError(null);
      } else {
        setAttendanceLogs([]);
      }
    } catch (err) {
      console.error('Error fetching attendance logs:', err);
      setError(err.response?.data?.message || 'Failed to fetch attendance logs');
      setAttendanceLogs([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AttendanceContainer>
        <LoadingText>Loading attendance logs...</LoadingText>
      </AttendanceContainer>
    );
  }

  if (error) {
    return (
      <AttendanceContainer>
        <ErrorText>{error}</ErrorText>
      </AttendanceContainer>
    );
  }

  return (
    <AttendanceContainer>
      <Title>Attendance History</Title>
      <Button onClick={createTestData}>Create Test Data</Button>
      <Table>
        <thead>
          <tr>
            <Th>Date</Th>
            <Th>Module</Th>
            <Th>Status</Th>
            <Th>Remarks</Th>
          </tr>
        </thead>
        <tbody>
          {attendanceLogs.map((log) => (
            <tr key={log._id}>
              <Td>{new Date(log.date).toLocaleDateString()}</Td>
              <Td>{log.moduleTitle}</Td>
              <Td>
                <StatusBadge status={log.status}>
                  {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                </StatusBadge>
              </Td>
              <Td>{log.remarks}</Td>
            </tr>
          ))}
          {attendanceLogs.length === 0 && (
            <tr>
              <Td colSpan="4" style={{ textAlign: 'center' }}>
                No attendance records found
              </Td>
            </tr>
          )}
        </tbody>
      </Table>
    </AttendanceContainer>
  );
};

export default AttendanceLog; 