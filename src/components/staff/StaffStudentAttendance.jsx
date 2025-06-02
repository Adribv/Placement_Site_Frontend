import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { format } from 'date-fns';
import { API_ENDPOINTS } from '../../config/api';

const Container = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  min-width: 200px;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  background-color: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  
  &:hover {
    background-color: #f1f5f9;
  }
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  color: #1a1a1a;
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

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const StaffStudentAttendance = ({ studentId }) => {
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModule, setSelectedModule] = useState('');
  const [modules, setModules] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date().setDate(new Date().getDate() - 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    const fetchModules = async () => {
      try {
        console.log('Fetching modules...');
        const response = await axios.get(API_ENDPOINTS.STAFF.MODULES, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('staffToken')}`
          }
        });
        console.log('Modules response:', response.data);
        setModules(response.data.data || []);
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError('Failed to fetch modules');
      }
    };

    fetchModules();
  }, []);

  useEffect(() => {
    const fetchAttendanceLogs = async () => {
      if (!studentId) {
        console.log('No studentId provided, skipping fetch');
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching attendance logs for student:', studentId);
        console.log('Using endpoint:', `${API_ENDPOINTS.STAFF.STUDENT_LOGS}/${studentId}/logs`);
        
        const response = await axios.get(`${API_ENDPOINTS.STAFF.STUDENT_LOGS}/${studentId}/logs`, {
          params: {
            moduleId: selectedModule || undefined,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('staffToken')}`
          }
        });

        console.log('Response from server:', response.data);

        if (response.data?.data) {
          const transformedLogs = response.data.data.map(log => ({
            _id: log._id,
            date: log.date,
            status: log.status,
            module: {
              _id: log.moduleId,
              name: log.moduleTitle
            },
            student: {
              _id: log.studentId,
              name: log.studentName
            },
            remarks: log.remarks
          }));
          console.log('Transformed logs:', transformedLogs);
          setAttendanceLogs(transformedLogs);
        } else {
          console.log('No data received from server');
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
        setError(err.response?.data?.message || 'Failed to fetch attendance logs');
        setAttendanceLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceLogs();
  }, [studentId, selectedModule, dateRange]);

  const calculateStats = () => {
    const totalClasses = attendanceLogs.length;
    const present = attendanceLogs.filter(log => log.status === 'present').length;
    const absent = attendanceLogs.filter(log => log.status === 'absent').length;
    const late = attendanceLogs.filter(log => log.status === 'late').length;
    const attendanceRate = totalClasses > 0 ? ((present + late) / totalClasses) * 100 : 0;

    return {
      totalClasses,
      present,
      absent,
      late,
      attendanceRate: attendanceRate.toFixed(1)
    };
  };

  if (loading) {
    console.log('Component is in loading state');
    return <LoadingText>Loading attendance records...</LoadingText>;
  }

  if (error) {
    console.log('Component has error:', error);
    return <ErrorText>{error}</ErrorText>;
  }

  console.log('Rendering component with logs:', attendanceLogs);

  const stats = calculateStats();

  return (
    <Container>
      <Title>Attendance Records</Title>
      
      <StatsContainer>
        <StatCard>
          <StatValue>{stats.totalClasses}</StatValue>
          <StatLabel>Total Classes</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.present}</StatValue>
          <StatLabel>Present</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.absent}</StatValue>
          <StatLabel>Absent</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.late}</StatValue>
          <StatLabel>Late</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.attendanceRate}%</StatValue>
          <StatLabel>Attendance Rate</StatLabel>
        </StatCard>
      </StatsContainer>

      <FilterContainer>
        <Select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
        >
          <option value="">All Modules</option>
          {modules.map(module => (
            <option key={module._id} value={module._id}>
              {module.name}
            </option>
          ))}
        </Select>
        <Input
          type="date"
          value={dateRange.startDate}
          onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
        />
        <Input
          type="date"
          value={dateRange.endDate}
          onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
        />
      </FilterContainer>

      {attendanceLogs.length === 0 ? (
        <ErrorText>No attendance records found for the selected filters.</ErrorText>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Module</Th>
              <Th>Status</Th>
              <Th>Student</Th>
              <Th>Remarks</Th>
            </tr>
          </thead>
          <tbody>
            {attendanceLogs.map((log) => (
              <tr key={log._id}>
                <Td>{format(new Date(log.date), 'MMM dd, yyyy')}</Td>
                <Td>{log.module?.name || 'N/A'}</Td>
                <Td>
                  <StatusBadge status={log.status}>
                    {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                  </StatusBadge>
                </Td>
                <Td>{log.student?.name || 'N/A'}</Td>
                <Td>{log.remarks || '-'}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default StaffStudentAttendance; 