import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import { API_ENDPOINTS } from '../../config/api';

const Container = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-top: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #1a1a1a;
  margin: 0;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div`
  background: #f8fafc;
  border-radius: 6px;
  padding: 1rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background: white;
  min-width: 150px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem;
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  color: #64748b;
  font-weight: 500;
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  color: #1a1a1a;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => props.present ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.present ? '#166534' : '#991b1b'};
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

const StudentAttendanceLogs = ({ studentId }) => {
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [modules, setModules] = useState([]);

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    if (studentId) {
      fetchAttendanceLogs();
    }
  }, [studentId, selectedModule, selectedMonth]);

  const fetchModules = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN.MODULES);
      if (response.data?.data) {
        setModules(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedModule(response.data.data[0]._id);
        }
      } else {
        setModules([]);
      }
    } catch (err) {
      console.error('Error fetching modules:', err);
      setError(err.response?.data?.message || 'Failed to load modules');
    }
  };

  const fetchAttendanceLogs = async () => {
    try {
      setLoading(true);
      console.log('Fetching attendance logs for student:', studentId);
      
      const response = await api.get(`${API_ENDPOINTS.ADMIN.STUDENT_ATTENDANCE}/${studentId}`, {
        params: {
          moduleId: selectedModule || undefined,
          month: selectedMonth || undefined
        }
      });

      console.log('Response from server:', response.data);

      if (response.data?.data) {
        const transformedLogs = response.data.data.map(log => ({
          _id: log._id,
          date: log.date,
          module: {
            _id: log.moduleId || '',
            title: log.moduleTitle || 'Unknown Module'
          },
          present: log.status === 'present',
          markedBy: {
            name: log.markedBy?.name || 'System'
          }
        }));
        setAttendanceLogs(transformedLogs);
      } else {
        setAttendanceLogs([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching attendance logs:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.message || 'Failed to load attendance logs');
    } finally {
      setLoading(false);
    }
  };

  const getMonthOptions = () => {
    const months = [];
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push({
        value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        label: date.toLocaleString('default', { month: 'long', year: 'numeric' })
      });
    }
    return months;
  };

  const calculateStats = () => {
    const totalDays = attendanceLogs.length;
    const presentDays = attendanceLogs.filter(log => log.present).length;
    const absentDays = totalDays - presentDays;
    const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    return {
      totalDays,
      presentDays,
      absentDays,
      attendancePercentage
    };
  };

  const stats = calculateStats();

  if (loading) {
    return <LoadingText>Loading attendance records...</LoadingText>;
  }

  if (error) {
    return <ErrorText>{error}</ErrorText>;
  }

  return (
    <Container>
      <Header>
        <Title>Attendance Records</Title>
      </Header>

      <StatsContainer>
        <StatCard>
          <StatValue>{stats.totalDays}</StatValue>
          <StatLabel>Total Days</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.presentDays}</StatValue>
          <StatLabel>Present Days</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.absentDays}</StatValue>
          <StatLabel>Absent Days</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.attendancePercentage}%</StatValue>
          <StatLabel>Attendance Rate</StatLabel>
        </StatCard>
      </StatsContainer>

      <FiltersContainer>
        <Select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
        >
          {modules.map(module => (
            <option key={module._id} value={module._id}>
              {module.title}
            </option>
          ))}
        </Select>

        <Select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">All Months</option>
          {getMonthOptions().map(month => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </Select>
      </FiltersContainer>

      <Table>
        <thead>
          <tr>
            <Th>Date</Th>
            <Th>Module</Th>
            <Th>Status</Th>
            <Th>Marked By</Th>
          </tr>
        </thead>
        <tbody>
          {attendanceLogs.map((log) => (
            <tr key={log._id}>
              <Td>{new Date(log.date).toLocaleDateString()}</Td>
              <Td>{log.module.title}</Td>
              <Td>
                <StatusBadge present={log.present}>
                  {log.present ? 'Present' : 'Absent'}
                </StatusBadge>
              </Td>
              <Td>{log.markedBy.name}</Td>
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
    </Container>
  );
};

export default StudentAttendanceLogs; 