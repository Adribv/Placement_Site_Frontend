import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { format } from 'date-fns';
import { API_ENDPOINTS } from '../../config/api';
import StaffStudentAttendance from '../../components/staff/StaffStudentAttendance';

const Container = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 2rem;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  min-width: 200px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  background-color: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  font-weight: 600;
  color: #475569;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  color: #1a1a1a;
`;

const ViewLogsButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2563eb;
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${props => 
    props.status === 'present' ? '#dcfce7' : 
    props.status === 'absent' ? '#fee2e2' : 
    '#fef3c7'};
  color: ${props => 
    props.status === 'present' ? '#166534' : 
    props.status === 'absent' ? '#991b1b' : 
    '#92400e'};
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

const BackButton = styled.button`
  padding: 0.5rem 1rem;
  background: #f1f5f9;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #475569;
  
  &:hover {
    background: #e2e8f0;
  }
`;

const StaffAttendance = () => {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    if (selectedModule) {
      fetchAttendanceLogs();
    }
  }, [selectedModule]);

  const fetchModules = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.STAFF.MODULES, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('staffToken')}`
        }
      });
      setModules(response.data.data || []);
      if (response.data.data?.length > 0) {
        setSelectedModule(response.data.data[0]._id);
      }
    } catch (err) {
      console.error('Error fetching modules:', err);
      setError('Failed to fetch modules');
    }
  };

  const fetchAttendanceLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_ENDPOINTS.STAFF.ATTENDANCE}/${selectedModule}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('staffToken')}`
        }
      });

      if (response.data?.data) {
        const sortedLogs = response.data.data.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        setAttendanceLogs(sortedLogs);
      } else {
        setAttendanceLogs([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching attendance logs:', err);
      setError(err.response?.data?.message || 'Failed to fetch attendance logs');
      setAttendanceLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewLogs = (student) => {
    if (student && student._id) {
      setSelectedStudent(student);
    }
  };

  const handleBack = () => {
    setSelectedStudent(null);
  };

  if (loading) {
    return <LoadingText>Loading attendance logs...</LoadingText>;
  }

  if (error) {
    return <ErrorText>{error}</ErrorText>;
  }

  if (selectedStudent) {
    return (
      <Container>
        <BackButton onClick={handleBack}>
          ← Back to Attendance List
        </BackButton>
        <StaffStudentAttendance studentId={selectedStudent._id} />
      </Container>
    );
  }

  return (
    <Container>
      <Title>Attendance Management</Title>
      <FilterContainer>
        <Select 
          value={selectedModule} 
          onChange={(e) => setSelectedModule(e.target.value)}
        >
          <option value="">Select Module</option>
          {modules.map(module => (
            <option key={module._id} value={module._id}>
              {module.title}
            </option>
          ))}
        </Select>
      </FilterContainer>

      <Table>
        <thead>
          <tr>
            <Th>Date</Th>
            <Th>Student</Th>
            <Th>Status</Th>
            <Th>Marked By</Th>
            <Th>Remarks</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {attendanceLogs.map((log) => (
            <tr key={log._id}>
              <Td>{format(new Date(log.date), 'dd/MM/yyyy')}</Td>
              <Td>{log.studentId?.name || '-'}</Td>
              <Td>
                <StatusBadge status={log.status}>
                  {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                </StatusBadge>
              </Td>
              <Td>{log.markedBy?.name || '-'}</Td>
              <Td>{log.remarks || '-'}</Td>
              <Td>
                <ViewLogsButton 
                  onClick={() => handleViewLogs(log.studentId)}
                  type="button"
                >
                  View Logs
                </ViewLogsButton>
              </Td>
            </tr>
          ))}
          {attendanceLogs.length === 0 && (
            <tr>
              <Td colSpan="6" style={{ textAlign: 'center' }}>
                No attendance records found
              </Td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default StaffAttendance; 